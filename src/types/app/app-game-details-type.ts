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

export const GameDetailsCreateSchema = (t: Translate) =>
  GameDetailsSchema(t).pick({
    status: true,
    game: true,
    questions: true,
  });

export const GameDetailsUpdateSchema = (t: Translate) =>
  GameDetailsCreateSchema(t)
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: t("app.games.details.validation.update")
    })

export type GameDetails = z.infer<ReturnType<typeof GameDetailsSchema>>;
export type CreateGameDetails = z.infer<ReturnType<typeof GameDetailsCreateSchema>>;
export type UpdateGameDetails = z.infer<ReturnType<typeof GameDetailsUpdateSchema>>;
