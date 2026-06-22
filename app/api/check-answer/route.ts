import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { extractOpenAIErrorMessage, extractOpenAIOutputText } from "@/lib/openai-response";
import { CheckAnswerResponseSchema, ExerciseTypeSchema } from "@/lib/vocab-schemas";

const InputSchema = z.object({
  prompt: z.string(),
  expected: z.string(),
  answer: z.string(),
  grammar: z.string().optional(),
  exerciseType: ExerciseTypeSchema
});

const SYSTEM_PROMPT = `You are a strict but useful German teacher for Ukrainian-speaking learners.
Return ONLY valid JSON: { "isCorrect": boolean, "score": number, "feedback": string, "errorType": string | null, "betterAnswer": string | null }.
Do not over-penalize tiny punctuation differences. Penalize wrong case, wrong preposition, wrong article, wrong verb form, unnatural phrase, or wrong meaning.`;

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
      return NextResponse.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 });
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
        max_output_tokens: 1200
      })
    });

    const data: unknown = await openaiResponse.json();

    if (!openaiResponse.ok) {
      const message = extractOpenAIErrorMessage(data, "OpenAI answer-check request failed");
      return NextResponse.json({ error: message }, { status: openaiResponse.status });
    }

    const text = extractOpenAIOutputText(data).trim();
    if (!text) throw new Error("OpenAI returned an empty answer-check response.");

    return NextResponse.json(CheckAnswerResponseSchema.parse(parseJsonObject(text)));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
