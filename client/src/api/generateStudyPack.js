import { StudyPackSchema } from "../utils/validateStudyPack";

export async function generateStudyPack(notes, signal) {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ notes }),
    signal,
  });

  const payload = await response.json();

  if (!response.ok) {
    const message = payload.error || "Failed to generate study pack";
    throw new Error(message);
  }

  if (!payload.data) {
    throw new Error("Server returned an unexpected response");
  }

  const validated = StudyPackSchema.safeParse(payload.data);
  if (!validated.success) {
    throw new Error("Received study data in an unexpected shape");
  }

  return validated.data;
}
