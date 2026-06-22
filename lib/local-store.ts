import type { ReviewLog, VocabCard } from "@/types/vocab";
import { parseArrayItems, ReviewLogSchema, VocabCardSchema } from "@/lib/vocab-schemas";

const CARDS_KEY = "wortwerk.cards";
const REVIEWS_KEY = "wortwerk.reviews";

function readJsonArray(raw: string | null): unknown[] {
  if (!raw) return [];

  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function loadCards(): VocabCard[] {
  if (typeof window === "undefined") return [];
  return parseArrayItems(readJsonArray(window.localStorage.getItem(CARDS_KEY)), VocabCardSchema);
}

export function saveCards(cards: VocabCard[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
}

export function upsertCards(cards: VocabCard[]) {
  const existing = loadCards();
  const map = new Map<string, VocabCard>();

  existing.forEach((card) => {
    if (card.id) map.set(card.id, card);
  });

  cards.forEach((card) => {
    if (card.id) map.set(card.id, card);
  });

  saveCards(Array.from(map.values()));
}

export function loadDueCards(limit = 20): VocabCard[] {
  const now = new Date().toISOString();
  return loadCards()
    .filter((card) => card.nextReviewAt <= now)
    .sort((a, b) => a.nextReviewAt.localeCompare(b.nextReviewAt))
    .slice(0, limit);
}

export function saveReviewLog(log: ReviewLog) {
  if (typeof window === "undefined") return;
  const logs = loadReviewLogs();
  logs.push(log);
  window.localStorage.setItem(REVIEWS_KEY, JSON.stringify(logs));
}

export function loadReviewLogs(): ReviewLog[] {
  if (typeof window === "undefined") return [];
  return parseArrayItems(readJsonArray(window.localStorage.getItem(REVIEWS_KEY)), ReviewLogSchema);
}

export function clearLocalData() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CARDS_KEY);
  window.localStorage.removeItem(REVIEWS_KEY);
}
