import z from "zod";
import type { useTranslate } from "@refinedev/core";
import { GameSchema, GameStatusSchema } from "./app-games-type";
import { createQuestionSchema } from "./app-questions-type";

type Translate = ReturnType<typeof useTranslate>;

// Yuri: `questions` now needs the active `t` to build its (localized)
// validation messages, so this schema is a factory too — see
// app-questions-type.ts for why.
export const createGameDetailsSchema = (t: Translate) =>
  z.object({
    id: z.string(),
    status: GameStatusSchema,
    game: GameSchema,
    questions: z.array(createQuestionSchema(t)),
    author: z.string(),
    created_at: z.string(), // date
  });

export type GameDetails = z.infer<ReturnType<typeof createGameDetailsSchema>>;
