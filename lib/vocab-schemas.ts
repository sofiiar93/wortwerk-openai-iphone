import { z } from "zod";

export const CardTypeSchema = z.enum(["noun", "verb", "phrase", "expression", "grammar"]);
export const CardStatusSchema = z.enum(["new", "learning", "review", "mastered"]);
export const ExerciseTypeSchema = z.enum(["de_to_ua", "ua_to_de", "cloze", "production"]);
export const DifficultySchema = z.enum(["again", "hard", "good", "easy"]);
export const GermanArticleSchema = z.enum(["der", "die", "das"]);
export const LevelSchema = z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]);

const OptionalStringSchema = z.string().optional();

export const VocabCardSchema = z.object({
  id: OptionalStringSchema,
  userId: OptionalStringSchema,
  listId: OptionalStringSchema,
  raw: OptionalStringSchema,
  german: z.string(),
  ukrainian: z.string(),
  type: CardTypeSchema,
  article: GermanArticleSchema.optional(),
  lemma: OptionalStringSchema,
  plural: OptionalStringSchema,
  preterite: OptionalStringSchema,
  participle: OptionalStringSchema,
  grammar: OptionalStringSchema,
  exampleDe: OptionalStringSchema,
  exampleUa: OptionalStringSchema,
  correctedGerman: OptionalStringSchema,
  correctionNote: OptionalStringSchema,
  commonMistakes: z.array(z.string()).optional(),
  topic: OptionalStringSchema,
  level: LevelSchema.optional(),
  status: CardStatusSchema,
  easeFactor: z.number(),
  intervalDays: z.number(),
  repetitions: z.number(),
  nextReviewAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const NormalizedCardSchema = VocabCardSchema.partial().extend({
  german: z.string(),
  ukrainian: z.string(),
  type: CardTypeSchema
});

export const WordListSchema = z.object({
  id: OptionalStringSchema,
  userId: z.string(),
  title: z.string(),
  rawText: z.string(),
  cardCount: z.number(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const ReviewLogSchema = z.object({
  id: OptionalStringSchema,
  userId: z.string(),
  cardId: z.string(),
  exerciseType: ExerciseTypeSchema,
  prompt: z.string(),
  answer: z.string(),
  isCorrect: z.boolean(),
  feedback: OptionalStringSchema,
  errorType: OptionalStringSchema,
  createdAt: z.string()
});

export const NormalizeApiResponseSchema = z.object({
  cards: z.array(NormalizedCardSchema)
});

export const CheckAnswerResponseSchema = z.object({
  isCorrect: z.boolean(),
  score: z.number(),
  feedback: z.string(),
  errorType: z.string().nullable(),
  betterAnswer: z.string().nullable()
});

export type CheckAnswerResponse = z.infer<typeof CheckAnswerResponseSchema>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function getApiErrorMessage(data: unknown, fallback: string): string {
  if (!isRecord(data)) return fallback;
  return typeof data.error === "string" ? data.error : fallback;
}

export function parseArrayItems<T>(value: unknown, schema: z.ZodType<T>): T[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    const parsed = schema.safeParse(item);
    return parsed.success ? [parsed.data] : [];
  });
}
