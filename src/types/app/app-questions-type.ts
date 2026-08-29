import { z } from "zod";
import type { useTranslate } from "@refinedev/core";

// Error validation uses localization.
type Translate = ReturnType<typeof useTranslate>;

const BaseQuestionSchema = (t: Translate) =>
  z.object({
    id: z.string().readonly(),
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
  });

const MultipleChoiceQuestionSchema = (t: Translate) =>
  BaseQuestionSchema(t).extend({
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

const EssayQuestionSchema = (t: Translate) =>
  BaseQuestionSchema(t).extend({
    is_essay_question: z.literal(true),
    // correct answers are minimum of 1 and maximum of 2 other variance
    correct_answers: z
      .array(z.string().max(150))
      .min(1)
      .max(3)
      .refine((answers) => answers.some((answer) => answer.trim().length > 0), {
        message: t("app.games.questions.errors.correct_answer_required"),
      }),
    // hints are optional with maximum 3
    hints: z.array(z.string().max(100)).max(3).optional(),
    correct_validation: z.string().max(500),
    incorrect_validation: z.string().max(500),
  });

export const QuestionSchema = (t: Translate) =>
  z.discriminatedUnion("is_essay_question", [
    MultipleChoiceQuestionSchema(t),
    EssayQuestionSchema(t),
  ]);

export type MultipleChoiceQuestion = z.infer<
  ReturnType<typeof MultipleChoiceQuestionSchema>
>;

export type EssayQuestion = z.infer<
  ReturnType<typeof EssayQuestionSchema>
>;

export type Question = z.infer<ReturnType<typeof QuestionSchema>>;
