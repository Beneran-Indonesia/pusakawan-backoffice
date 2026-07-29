import z from "zod";
import { GameSchema } from "./app-games-type";
import { QuestionSchema } from "./app-questions-type";

export const GameStatusSchema = z.enum(["draft", "published"]);

export const GameDetailsSchema = z.object({
    id: z.string(),
    game: GameSchema,
    status: GameStatusSchema,
    questions: z.array(QuestionSchema),
    created_at: z.string(), // date
})

export type GameStatus = z.infer<typeof GameStatusSchema>;

export type GameDetails = z.infer<typeof GameDetailsSchema>