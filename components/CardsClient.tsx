"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { loadCards } from "@/lib/local-store";
import type { VocabCard } from "@/types/vocab";

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("uk-UA");
}

function matchesQuery(card: VocabCard, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  return [
    card.german,
    card.correctedGerman,
    card.ukrainian,
    card.exampleDe,
    card.exampleUa,
    card.grammar,
    card.topic
  ]
    .filter((value): value is string => Boolean(value))
    .some((value) => value.toLowerCase().includes(normalizedQuery));
}

export function CardsClient() {
  const [cards, setCards] = useState<VocabCard[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setCards(loadCards());
  }, []);

  const filteredCards = useMemo(
    () => cards.filter((card) => matchesQuery(card, query)),
    [cards, query]
  );

  return (
    <main className="stack">
      <section className="hero">
        <h1>Cards</h1>
        <p>Повний перелік збережених карток. Тут показано слово або фразу, переклад, приклад застосування і дату наступного повторення.</p>
        <div className="row">
          <Link className="button" href="/import">Додати список</Link>
          <Link className="button secondary" href="/review">Повторювати</Link>
        </div>
      </section>

      <section className="card">
        <div className="form-row">
          <label className="label" htmlFor="cardSearch">Пошук у переліку</label>
          <input
            id="cardSearch"
            className="input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Наприклад: Konsum, уникати, Gedanken"
          />
        </div>

        {filteredCards.length === 0 ? (
          <p className="muted">Карток ще немає або нічого не знайдено. Спершу імпортуйте список.</p>
        ) : (
          <table className="table mobile-card-table">
            <thead>
              <tr><th>DE</th><th>UA</th><th>Приклад</th><th>Status</th><th>Next review</th></tr>
            </thead>
            <tbody>
              {filteredCards.map((card, index) => (
                <tr key={card.id ?? `${card.german}-${index}`}>
                  <td className="mobile-primary-cell" data-label="DE">
                    <strong>{card.correctedGerman || card.german}</strong>
                    {card.correctedGerman && card.correctedGerman !== card.german && <span className="muted">{card.german}</span>}
                  </td>
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
        )}
      </section>
    </main>
  );
}
