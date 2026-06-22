"use client";

import { useEffect, useMemo, useState } from "react";
import { loadDueCards, saveCards, saveReviewLog, loadCards } from "@/lib/local-store";
import { scheduleNextReview } from "@/lib/srs";
import { CheckAnswerResponseSchema, ExerciseTypeSchema, getApiErrorMessage } from "@/lib/vocab-schemas";
import type { CheckAnswerResponse } from "@/lib/vocab-schemas";
import type { Difficulty, ExerciseType, VocabCard } from "@/types/vocab";

function makePrompt(card: VocabCard, exerciseType: ExerciseType) {
  const german = card.correctedGerman || card.german;
  if (exerciseType === "de_to_ua") return { prompt: `Переклади українською: ${german}`, expected: card.ukrainian };
  if (exerciseType === "ua_to_de") return { prompt: `Переклади німецькою: ${card.ukrainian}`, expected: german };
  if (exerciseType === "cloze") return { prompt: `Створи речення з пропуском подумки й введи правильну форму: ${card.ukrainian}`, expected: german };
  return { prompt: `Напиши власне німецьке речення з: ${german}`, expected: german };
}

export function ReviewTrainer() {
  const [cards, setCards] = useState<VocabCard[]>([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [exerciseType, setExerciseType] = useState<ExerciseType>("ua_to_de");
  const [result, setResult] = useState<CheckAnswerResponse | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    setCards(loadDueCards(20));
  }, []);

  const card = cards[index];
  const task = useMemo(() => card ? makePrompt(card, exerciseType) : null, [card, exerciseType]);

  async function checkAnswer() {
    if (!card || !task || !answer.trim()) return;
    setIsChecking(true);
    setResult(null);
    try {
      const response = await fetch("/api/check-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, answer, grammar: card.grammar, exerciseType })
      });
      const data: unknown = await response.json();
      if (!response.ok) throw new Error(getApiErrorMessage(data, "Check failed"));
      setResult(CheckAnswerResponseSchema.parse(data));
    } catch (error) {
      const expected = task.expected.trim().toLowerCase();
      const actual = answer.trim().toLowerCase();
      setResult({
        isCorrect: expected === actual,
        score: expected === actual ? 1 : 0,
        feedback: error instanceof Error ? `AI-перевірка недоступна: ${error.message}. Виконано базову перевірку.` : "AI-перевірка недоступна.",
        errorType: expected === actual ? null : "manual_check_needed",
        betterAnswer: task.expected
      });
    } finally {
      setIsChecking(false);
    }
  }

  function grade(difficulty: Difficulty) {
    if (!card || !task) return;
    const updated = scheduleNextReview(card, difficulty);
    const allCards = loadCards().map((item) => item.id === card.id ? updated : item);
    saveCards(allCards);
    saveReviewLog({
      id: `${Date.now()}-${card.id}`,
      userId: "local-demo-user",
      cardId: card.id || "unknown",
      exerciseType,
      prompt: task.prompt,
      answer,
      isCorrect: result?.isCorrect ?? difficulty !== "again",
      feedback: result?.feedback,
      errorType: result?.errorType || undefined,
      createdAt: new Date().toISOString()
    });
    setAnswer("");
    setResult(null);
    setIndex((prev) => prev + 1);
  }

  if (!card || !task) {
    return (
      <section className="card">
        <h1>Review Mode</h1>
        <p className="muted">Немає карток до повторення. Імпортуйте список або зачекайте до наступного повторення.</p>
      </section>
    );
  }

  return (
    <section className="card stack">
      <div className="row">
        <span className="badge">{index + 1} / {cards.length}</span>
        <select className="input" style={{ maxWidth: 220 }} value={exerciseType} onChange={(e) => { const parsed = ExerciseTypeSchema.safeParse(e.target.value); if (parsed.success) setExerciseType(parsed.data); setResult(null); setAnswer(""); }}>
          <option value="ua_to_de">UA → DE</option>
          <option value="de_to_ua">DE → UA</option>
          <option value="production">Власне речення</option>
        </select>
      </div>

      <h1>{task.prompt}</h1>
      {card.grammar && <p className="muted">Підказка-граматика: {card.grammar}</p>}
      <textarea className="textarea" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Ваша відповідь…" />
      <div className="row">
        <button className="button" onClick={checkAnswer} disabled={isChecking}>{isChecking ? "Перевірка…" : "Перевірити"}</button>
        <button className="button secondary" onClick={() => setResult({ isCorrect: false, score: 0, feedback: "Очікувана відповідь показана вручну.", errorType: "revealed", betterAnswer: task.expected })}>Показати відповідь</button>
      </div>

      {result && (
        <div className="answer">
          <p className={result.isCorrect ? "ok" : "danger-text"}>{result.isCorrect ? "Правильно" : "Потрібне виправлення"}</p>
          <p>{result.feedback}</p>
          {result.betterAnswer && <p><strong>Краще:</strong> {result.betterAnswer}</p>}
          {result.errorType && <p><strong>Тип помилки:</strong> {result.errorType}</p>}
          <div className="row">
            <button className="button danger" onClick={() => grade("again")}>Again</button>
            <button className="button secondary" onClick={() => grade("hard")}>Hard</button>
            <button className="button secondary" onClick={() => grade("good")}>Good</button>
            <button className="button" onClick={() => grade("easy")}>Easy</button>
          </div>
        </div>
      )}
    </section>
  );
}
