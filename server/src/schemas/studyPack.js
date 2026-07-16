import { z } from "zod";

export const FlashcardSchema = z.object({
  id: z.string().min(1),
  front: z.string().min(1),
  back: z.string().min(1),
});

export const QuizQuestionSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  options: z.array(z.string().min(1)).min(2).max(6),
  correctIndex: z.number().int().min(0),
  explanation: z.string().optional(),
});

export const StudyPackSchema = z
  .object({
    title: z.string().min(1),
    summary: z.string().optional(),
    flashcards: z.array(FlashcardSchema).min(1),
    quiz: z.array(QuizQuestionSchema).min(1),
  })
  .superRefine((data, ctx) => {
    for (const [index, question] of data.quiz.entries()) {
      if (question.correctIndex >= question.options.length) {
        ctx.addIssue({
          code: "custom",
          message: `Quiz question ${index + 1} has an invalid correctIndex`,
          path: ["quiz", index, "correctIndex"],
        });
      }
    }
  });
