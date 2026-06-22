"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { clearLocalData, loadCards, loadReviewLogs } from "@/lib/local-store";
import type { ReviewLog, VocabCard } from "@/types/vocab";

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("uk-UA");
}

export function DashboardClient() {
  const [cards, setCards] = useState<VocabCard[]>([]);
  const [logs, setLogs] = useState<ReviewLog[]>([]);

  useEffect(() => {
    setCards(loadCards());
    setLogs(loadReviewLogs());
  }, []);

  const stats = useMemo(() => {
    const due = cards.filter((card) => card.nextReviewAt <= new Date().toISOString()).length;
    const mastered = cards.filter((card) => card.status === "mastered").length;
    const incorrect = logs.filter((log) => !log.isCorrect).length;
    const weakest = logs.filter((log) => log.errorType).reduce<Record<string, number>>((acc, log) => {
      const key = log.errorType || "unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const weakestEntry = Object.entries(weakest).sort((a, b) => b[1] - a[1])[0];
    return { total: cards.length, due, mastered, incorrect, weakest: weakestEntry?.[0] || "—" };
  }, [cards, logs]);

  function reset() {
    clearLocalData();
    setCards([]);
    setLogs([]);
  }

  return (
    <main className="stack">
      <section className="hero">
        <h1>Dashboard</h1>
        <p>MVP працює в localStorage. Firebase-підключення вже закладене в коді як наступний крок.</p>
        <div className="row">
          <Link className="button" href="/import">Імпортувати</Link>
          <Link className="button secondary" href="/review">Повторювати</Link>
          <button className="button danger" onClick={reset}>Очистити demo-дані</button>
        </div>
      </section>
      <section className="grid">
        <div className="card"><h2>{stats.total}</h2><p className="muted">усіх карток</p></div>
        <div className="card"><h2>{stats.due}</h2><p className="muted">до повторення сьогодні</p></div>
        <div className="card"><h2>{stats.mastered}</h2><p className="muted">mastered</p></div>
        <div className="card"><h2>{stats.weakest}</h2><p className="muted">найчастіший тип помилки</p></div>
      </section>
      <section className="card">
        <h2>Останні картки</h2>
        <table className="table mobile-card-table">
          <thead><tr><th>DE</th><th>UA</th><th>Приклад</th><th>Status</th><th>Next review</th></tr></thead>
          <tbody>
            {cards.slice(0, 12).map((card, index) => (
              <tr key={card.id ?? `${card.german}-${index}`}>
                <td className="mobile-primary-cell" data-label="DE">{card.correctedGerman || card.german}</td>
                <td data-label="UA">{card.ukrainian}</td>
                <td data-label="Приклад">
                  <div className="example-block">
                    <strong>{card.exampleDe || "—"}</strong>
                    {card.exampleUa && <span className="muted">{card.exampleUa}</span>}
                  </div>
                </td>
                <td data-label="Status"><span className="badge">{card.status}</span></td>
                <td data-label="Next">{formatDate(card.nextReviewAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
