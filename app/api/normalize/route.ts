import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { extractOpenAIErrorMessage, extractOpenAIOutputText } from "@/lib/openai-response";
import { CardTypeSchema, LevelSchema } from "@/lib/vocab-schemas";

const InputSchema = z.object({
  cards: z.array(z.object({
    german: z.string(),
    ukrainian: z.string(),
    type: z.string(),
    grammar: z.string().optional(),
    exampleDe: z.string().optional(),
    exampleUa: z.string().optional(),
    raw: z.string().optional(),
    correctedGerman: z.string().optional(),
    correctionNote: z.string().optional()
  })).min(1).max(40)
});

const OutputSchema = z.object({
  cards: z.array(z.object({
    german: z.string(),
    ukrainian: z.string(),
    type: CardTypeSchema,
    correctedGerman: z.string().optional(),
    correctionNote: z.string().optional(),
    grammar: z.string().optional(),
    exampleDe: z.string(),
    exampleUa: z.string(),
    topic: z.string(),
    level: LevelSchema,
    commonMistakes: z.array(z.string())
  }))
});

const SYSTEM_PROMPT = `You are a strict German B1 vocabulary normalizer for Ukrainian-speaking learners.
Return ONLY valid JSON. Do not wrap in markdown.
For each card:
- correct unnatural or grammatically wrong German
- preserve the learner's original meaning
- add one natural B1-level German example
- add Ukrainian translation of the example
- add grammar note when useful
- add common mistakes
- classify topic and CEFR level
- be concise and accurate
Schema:
{ "cards": [{ "german": string, "ukrainian": string, "type": "noun"|"verb"|"phrase"|"expression"|"grammar", "correctedGerman"?: string, "correctionNote"?: string, "grammar"?: string, "exampleDe": string, "exampleUa": string, "topic": string, "level": "A1"|"A2"|"B1"|"B2"|"C1"|"C2", "commonMistakes": string[] }] }`;

function parseJsonObject(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error("OpenAI returned text that is not valid JSON.");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = InputSchema.parse(await request.json());

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const model = process.env.OPENAI_MODEL || "gpt-5.4-mini";

    const openaiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        instructions: SYSTEM_PROMPT,
        input: JSON.stringify(body, null, 2),
        max_output_tokens: 5000
      })
    });

    const data: unknown = await openaiResponse.json();

    if (!openaiResponse.ok) {
      const message = extractOpenAIErrorMessage(data, "OpenAI normalization request failed");
      return NextResponse.json({ error: message }, { status: openaiResponse.status });
    }

    const text = extractOpenAIOutputText(data).trim();
    if (!text) throw new Error("OpenAI returned an empty normalization response.");

    return NextResponse.json(OutputSchema.parse(parseJsonObject(text)));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
