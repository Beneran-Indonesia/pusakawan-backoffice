import { z } from "zod";
import type { useTranslate } from "@refinedev/core";

// Yuri: validation messages must go through `t(...)` — these schemas used to
// hardcode English strings (e.g. "Question text is required") as plain zod
// error messages. Since the schema was built once at module scope, those
// messages never picked up the active language even after switching it in
// the UI. Turning each schema into a factory that takes the current
// `translate` function fixes that: callers rebuild the schema (see
// games-form.tsx) whenever the language changes, so error messages stay in
// sync with i18n like everything else on this form.
type Translate = ReturnType<typeof useTranslate>;

const createBaseQuestionSchema = (t: Translate) =>
  z.object({
    id: z.string(),
    question: z
      .string()
      .min(1, t("app.games.questions.errors.question_required"))
      .max(300),
    media: z
      .object({
        id: z.string(),
        type: z.enum(["image", "audio", "video"]),
        url: z.string().url(), // S3 URL
        file_name: z.string(),
        file_size: z.number().nonnegative(),
      })
      .optional(),
    pusaka_points: z
      .number({
        invalid_type_error: t("app.games.questions.errors.points_invalid_type"),
      })
      .nonnegative(t("app.games.questions.errors.points_negative")),
    correct_validation: z.string().max(500),
    incorrect_validation: z.string().max(500),
  });

const createMultipleChoiceQuestionSchema = (t: Translate) =>
  createBaseQuestionSchema(t).extend({
    is_essay_question: z.literal(false),
    options: z.object({
      a: z
        .string()
        .min(1, t("app.games.questions.errors.option_required"))
        .max(100),
      b: z
        .string()
        .min(1, t("app.games.questions.errors.option_required"))
        .max(100),
      c: z
        .string()
        .min(1, t("app.games.questions.errors.option_required"))
        .max(100),
      d: z
        .string()
        .min(1, t("app.games.questions.errors.option_required"))
        .max(100),
    }),
    correct_answer: z.enum(["a", "b", "c", "d"]),
  });

const createEssayQuestionSchema = (t: Translate) =>
  createBaseQuestionSchema(t).extend({
    is_essay_question: z.literal(true),
    correct_answers: z
      .array(z.string().max(300))
      .min(1)
      .max(3)
      .refine((answers) => answers.some((answer) => answer.trim().length > 0), {
        message: t("app.games.questions.errors.correct_answer_required"),
      }),
    hints: z.array(z.string().max(100)).max(3),
  });

export const createQuestionSchema = (t: Translate) =>
  z.discriminatedUnion("is_essay_question", [
    createMultipleChoiceQuestionSchema(t),
    createEssayQuestionSchema(t),
  ]);

export type MultipleChoiceQuestion = z.infer<
  ReturnType<typeof createMultipleChoiceQuestionSchema>
>;

export type EssayQuestion = z.infer<
  ReturnType<typeof createEssayQuestionSchema>
>;

export type Question = z.infer<ReturnType<typeof createQuestionSchema>>;
