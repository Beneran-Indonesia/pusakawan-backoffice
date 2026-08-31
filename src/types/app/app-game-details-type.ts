import z from "zod";
import type { useTranslate } from "@refinedev/core";
import { GameSchema, GameStatusSchema } from "./app-games-type";
import { QuestionSchema } from "./app-questions-type";
import { BasicUserSchema } from "../users-type";

// Error validation uses localization.
type Translate = ReturnType<typeof useTranslate>;

export const GameDetailsSchema = (t: Translate) =>
  z.object({
    id: z.string().readonly(),
    status: GameStatusSchema,
    game: GameSchema,
    questions: z.array(QuestionSchema(t)),
    author: BasicUserSchema.readonly(),
    updated_at: z.string().optional(), // datetime + timezone
    created_at: z.string(), // datetime + timezone
  });


export type GameDetails = z.infer<ReturnType<typeof GameDetailsSchema>>;
