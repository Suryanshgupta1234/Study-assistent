function stripCodeFences(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();
  return text.trim();
}

function extractJsonObject(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  return text.slice(start, end + 1);
}

function repairJson(text) {
  return text
    .replace(/,\s*([}\]])/g, "$1")
    .replace(/\r\n/g, "\n")
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, " ")
    .trim();
}

export function parseModelJson(raw) {
  const candidates = [
    raw,
    stripCodeFences(raw),
    extractJsonObject(raw) ?? "",
    extractJsonObject(stripCodeFences(raw)) ?? "",
  ].filter(Boolean);

  const uniqueCandidates = [...new Set(candidates)];
  let lastError = null;

  for (const candidate of uniqueCandidates) {
    for (const attempt of [candidate, repairJson(candidate)]) {
      try {
        return JSON.parse(attempt);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
      }
    }
  }

  throw new Error(
    lastError?.message ?? "Unable to parse JSON from model response"
  );
}
