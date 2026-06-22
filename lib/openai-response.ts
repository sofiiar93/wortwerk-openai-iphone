function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getContentParts(item: unknown): unknown[] {
  if (!isRecord(item)) return [];
  return Array.isArray(item.content) ? item.content : [];
}

export function extractOpenAIOutputText(data: unknown): string {
  if (isRecord(data) && typeof data.output_text === "string") {
    return data.output_text;
  }

  if (!isRecord(data) || !Array.isArray(data.output)) {
    return "";
  }

  return data.output
    .flatMap(getContentParts)
    .filter((part): part is { type: "output_text"; text: string } => (
      isRecord(part) && part.type === "output_text" && typeof part.text === "string"
    ))
    .map((part) => part.text)
    .join("\n");
}

export function extractOpenAIErrorMessage(data: unknown, fallback: string): string {
  if (!isRecord(data)) return fallback;

  const { error } = data;
  if (isRecord(error) && typeof error.message === "string") {
    return error.message;
  }

  return fallback;
}
