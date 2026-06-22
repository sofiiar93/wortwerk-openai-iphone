"use client";

import { useEffect, useMemo, useState } from "react";
import { loadReviewLogs } from "@/lib/local-store";
import type { ReviewLog } from "@/types/vocab";

export function MistakesClient() {
  const [logs, setLogs] = useState<ReviewLog[]>([]);

  useEffect(() => setLogs(loadReviewLogs()), []);

  const grouped = useMemo(() => {
    return logs.filter((log) => !log.isCorrect || log.errorType).reduce<Record<string, ReviewLog[]>>((acc, log) => {
      const key = log.errorType || "unknown";
      acc[key] ||= [];
      acc[key].push(log);
      return acc;
    }, {});
  }, [logs]);

  return (
    <main className="stack">
      <section className="hero">
        <h1>Мої помилки</h1>
        <p>Тут видно не просто “правильно/неправильно”, а тип помилки. Саме це робить додаток навчальним, а не декоративним.</p>
      </section>
      {Object.keys(grouped).length === 0 ? (
        <section className="card"><p className="muted">Помилок ще немає або review не проходився.</p></section>
      ) : Object.entries(grouped).map(([type, items]) => (
        <section className="card" key={type}>
          <h2>{type} <span className="badge">{items.length}</span></h2>
          <table className="table mobile-card-table">
            <thead><tr><th>Завдання</th><th>Відповідь</th><th>Фідбек</th></tr></thead>
            <tbody>
              {items.slice(0, 10).map((log, index) => (
                <tr key={log.id ?? `${log.cardId}-${index}`}>
                  <td className="mobile-primary-cell" data-label="Завдання">{log.prompt}</td>
                  <td data-label="Відповідь">{log.answer}</td>
                  <td data-label="Фідбек">{log.feedback || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </main>
  );
}
