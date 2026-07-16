import { Router } from "express";
import { z } from "zod";
import { generateStudyPackFromNotes } from "../services/llm.js";
import { StudyPackSchema } from "../schemas/studyPack.js";
import { parseModelJson } from "../utils/parseJson.js";

const router = Router();

const GenerateRequestSchema = z.object({
  notes: z.string().trim().min(10, "Please provide at least 10 characters"),
});

router.post("/", async (req, res) => {
  const parsedBody = GenerateRequestSchema.safeParse(req.body);
  if (!parsedBody.success) {
    return res.status(400).json({
      error: "Invalid request",
      details: parsedBody.error.flatten().fieldErrors,
    });
  }

  try {
    const rawContent = await generateStudyPackFromNotes(parsedBody.data.notes);
    const json = parseModelJson(rawContent);
    const studyPack = StudyPackSchema.parse(json);

    return res.json({ data: studyPack });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({
        error: "Model returned data in an unexpected shape",
        details: error.flatten(),
        retryable: true,
      });
    }

    const message =
      error instanceof Error ? error.message : "Unknown server error";

    const status = message.includes("timed out") ? 504 : 502;
    return res.status(status).json({
      error: message,
      retryable: true,
    });
  }
});

export default router;
