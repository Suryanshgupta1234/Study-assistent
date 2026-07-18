import { StudyPackSchema } from "../utils/validateStudyPack";

const API_URL = import.meta.env.VITE_API_URL;

export async function generateStudyPack(notes, signal) {
  const response = await fetch(`${API_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ notes }),
    signal,
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || "Failed to generate study pack");
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