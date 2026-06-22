import { addDays } from "date-fns";
import type { Difficulty, VocabCard } from "@/types/vocab";

export function scheduleNextReview(card: VocabCard, difficulty: Difficulty): VocabCard {
  const currentEase = card.easeFactor || 2.5;
  let intervalDays = card.intervalDays || 0;
  let repetitions = card.repetitions || 0;
  let easeFactor = currentEase;
  let status: VocabCard["status"] = "learning";

  if (difficulty === "again") {
    intervalDays = 0;
    repetitions = 0;
    easeFactor = Math.max(1.3, currentEase - 0.25);
    status = "learning";
  }

  if (difficulty === "hard") {
    intervalDays = Math.max(1, Math.round(intervalDays * 1.2) || 1);
    repetitions += 1;
    easeFactor = Math.max(1.3, currentEase - 0.15);
    status = "learning";
  }

  if (difficulty === "good") {
    repetitions += 1;
    intervalDays = repetitions === 1 ? 1 : repetitions === 2 ? 3 : Math.round(intervalDays * easeFactor);
    status = intervalDays >= 14 ? "mastered" : "review";
  }

  if (difficulty === "easy") {
    repetitions += 1;
    easeFactor = Math.min(3.0, currentEase + 0.15);
    intervalDays = repetitions <= 1 ? 4 : Math.max(7, Math.round(intervalDays * easeFactor * 1.25));
    status = intervalDays >= 14 ? "mastered" : "review";
  }

  return {
    ...card,
    easeFactor,
    intervalDays,
    repetitions,
    status,
    nextReviewAt: addDays(new Date(), intervalDays).toISOString(),
    updatedAt: new Date().toISOString()
  };
}
