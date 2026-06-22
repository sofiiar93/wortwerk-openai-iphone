export type CardType = "noun" | "verb" | "phrase" | "expression" | "grammar";
export type CardStatus = "new" | "learning" | "review" | "mastered";
export type ExerciseType = "de_to_ua" | "ua_to_de" | "cloze" | "production";
export type Difficulty = "again" | "hard" | "good" | "easy";

export interface VocabCard {
  id?: string;
  userId?: string;
  listId?: string;
  raw?: string;
  german: string;
  ukrainian: string;
  type: CardType;
  article?: "der" | "die" | "das";
  lemma?: string;
  plural?: string;
  preterite?: string;
  participle?: string;
  grammar?: string;
  exampleDe?: string;
  exampleUa?: string;
  correctedGerman?: string;
  correctionNote?: string;
  commonMistakes?: string[];
  topic?: string;
  level?: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  status: CardStatus;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  nextReviewAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface WordList {
  id?: string;
  userId: string;
  title: string;
  rawText: string;
  cardCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewLog {
  id?: string;
  userId: string;
  cardId: string;
  exerciseType: ExerciseType;
  prompt: string;
  answer: string;
  isCorrect: boolean;
  feedback?: string;
  errorType?: string;
  createdAt: string;
}

export interface NormalizedCard extends Partial<VocabCard> {
  german: string;
  ukrainian: string;
  type: CardType;
}
