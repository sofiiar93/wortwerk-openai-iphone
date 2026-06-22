"use client";

import { useMemo, useState } from "react";
import { parseVocabularyList } from "@/lib/parser";
import { SAMPLE_RAW_LIST } from "@/lib/sample-data";
import { upsertCards } from "@/lib/local-store";
import { getApiErrorMessage, NormalizeApiResponseSchema } from "@/lib/vocab-schemas";
import type { NormalizedCard, VocabCard } from "@/types/vocab";

function withIds(cards: NormalizedCard[]): VocabCard[] {
  return cards.map((card, index) => ({
    ...card,
    id: card.id || `${Date.now()}-${index}-${card.german.slice(0, 12)}`,
    status: card.status || "new",
    easeFactor: card.easeFactor || 2.5,
    intervalDays: card.intervalDays || 0,
    repetitions: card.repetitions || 0,
    nextReviewAt: card.nextReviewAt || new Date().toISOString(),
    createdAt: card.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
}

export function ImportTrainer() {
  const [rawText, setRawText] = useState(SAMPLE_RAW_LIST);
  const [cards, setCards] = useState<NormalizedCard[]>(() => parseVocabularyList(SAMPLE_RAW_LIST));
  const [isNormalizing, setIsNormalizing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const stats = useMemo(() => ({
    total: cards.length,
    corrections: cards.filter((card) => card.correctedGerman || card.correctionNote).length,
    grammar: cards.filter((card) => card.grammar).length
  }), [cards]);

  function parseNow() {
    const parsed = parseVocabularyList(rawText);
    setCards(parsed);
    setMessage(`Розпізнано ${parsed.length} карток.`);
  }

  async function normalizeWithOpenAI() {
    setIsNormalizing(true);
    setMessage(null);
    try {
      const response = await fetch("/api/normalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cards })
      });
      const data: unknown = await response.json();
      if (!response.ok) throw new Error(getApiErrorMessage(data, "Normalize failed"));
      const parsed = NormalizeApiResponseSchema.parse(data);
      setCards(parsed.cards);
      setMessage("OpenAI-нормалізацію виконано.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Невідома помилка нормалізації.");
    } finally {
      setIsNormalizing(false);
    }
  }

  function saveLocally() {
    upsertCards(withIds(cards));
    setMessage(`Збережено ${cards.length} карток у localStorage MVP.`);
  }

  return (
    <div className="stack">
      <section className="card">
        <h1>Import Mode</h1>
        <p className="muted">Вставте список від викладача. Парсер зробить базові картки; OpenAI API додасть нормалізацію, граматику й приклади.</p>
        <div className="form-row">
          <label className="label" htmlFor="rawText">Сирий список</label>
          <textarea id="rawText" className="textarea" value={rawText} onChange={(e) => setRawText(e.target.value)} />
        </div>
        <div className="row">
          <button className="button" onClick={parseNow}>1. Розібрати список</button>
          <button className="button secondary" onClick={normalizeWithOpenAI} disabled={isNormalizing || cards.length === 0}>
            {isNormalizing ? "Нормалізація…" : "2. Нормалізувати OpenAI"}
          </button>
          <button className="button" onClick={saveLocally} disabled={cards.length === 0}>3. Зберегти в MVP</button>
        </div>
        {message && <p className="answer">{message}</p>}
      </section>

      <section className="grid">
        <div className="card"><strong>{stats.total}</strong><p className="muted">карток</p></div>
        <div className="card"><strong>{stats.corrections}</strong><p className="muted">виправлень / нотаток</p></div>
        <div className="card"><strong>{stats.grammar}</strong><p className="muted">граматичних міток</p></div>
      </section>

      <section className="card">
        <h2>Попередній перегляд</h2>
        <table className="table mobile-card-table">
          <thead><tr><th>DE</th><th>UA</th><th>Приклад</th><th>Тип</th><th>Граматика / виправлення</th></tr></thead>
          <tbody>
            {cards.map((card, index) => (
              <tr key={`${card.german}-${index}`}>
                <td className="mobile-primary-cell" data-label="DE"><strong>{card.correctedGerman || card.german}</strong><br /><span className="muted">{card.correctedGerman && card.correctedGerman !== card.german ? card.german : ""}</span></td>
                <td data-label="UA">{card.ukrainian}</td>
                <td data-label="Приклад">
                  <div className="example-block">
                    <strong>{card.exampleDe || "—"}</strong>
                    {card.exampleUa && <span className="muted">{card.exampleUa}</span>}
                  </div>
                </td>
                <td data-label="Тип"><span className="badge">{card.type}</span></td>
                <td data-label="Граматика">{card.grammar || card.correctionNote || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
