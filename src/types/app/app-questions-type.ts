import { z } from "zod";

const BaseQuestionSchema = z.object({
    id: z.string(),
    question: z.string().max(300),
    media: z.object({
        id: z.string(),
        type: z.enum(["image", "audio", "video"]),
        url: z.string().url(), // S3 URL
        file_name: z.string(),
        file_size: z.number().nonnegative(),
    }).optional(),
    pusaka_points: z.number().nonnegative(),
    correct_validation: z.string().max(500),
    incorrect_validation: z.string().max(500),
});

const MultipleChoiceQuestionSchema = BaseQuestionSchema.extend({
    is_essay_question: z.literal(false),
    options: z.object({
        a: z.string().min(1).max(100),
        b: z.string().min(1).max(100),
        c: z.string().min(1).max(100),
        d: z.string().min(1).max(100),
    }),
    correct_answer: z.enum([
        "a",
        "b",
        "c",
        "d",
    ]),
});

const EssayQuestionSchema = BaseQuestionSchema.extend({
    is_essay_question: z.literal(true),
    correct_answers: z
        .array(z.string().max(300))
        .min(1)
        .max(3),
    hints: z.array(z.string().max(100)).max(3),
});

export const QuestionSchema = z.discriminatedUnion("is_essay_question", [
    MultipleChoiceQuestionSchema,
    EssayQuestionSchema,
]);

export type MultipleChoiceQuestion = z.infer<
    typeof MultipleChoiceQuestionSchema
>;

export type EssayQuestion = z.infer<typeof EssayQuestionSchema>;

export type Question = z.infer<typeof QuestionSchema>;