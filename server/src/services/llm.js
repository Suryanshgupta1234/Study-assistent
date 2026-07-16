const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";
const REQUEST_TIMEOUT_MS = 45_000;

const SYSTEM_PROMPT = `You are a study assistant. Given notes or a topic, return ONLY valid JSON (no markdown, no commentary) matching this schema:
{
  "title": "string",
  "summary": "optional string",
  "flashcards": [{ "id": "fc-1", "front": "question or term", "back": "answer or definition" }],
  "quiz": [{
    "id": "q-1",
    "question": "multiple choice question",
    "options": ["A", "B", "C", "D"],
    "correctIndex": 0,
    "explanation": "why the answer is correct"
  }]
}

Rules:
- Generate 5-8 flashcards and 4-6 quiz questions.
- Use unique string ids like fc-1, q-1.
- correctIndex is zero-based.
- Keep content accurate and concise.
- Return JSON only.`;

export async function generateStudyPackFromNotes(notes) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured on the server");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL ?? DEFAULT_MODEL,
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Create a study pack from this input:\n\n${notes}`,
          },
        ],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `LLM request failed (${response.status}): ${errorBody.slice(0, 300)}`
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content?.trim()) {
      throw new Error("Model returned an empty response");
    }

    return content;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out — the model took too long to respond");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
