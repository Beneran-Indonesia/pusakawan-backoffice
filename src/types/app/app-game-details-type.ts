import z from "zod";
import { GameSchema } from "./app-games-type";
import { QuestionSchema } from "./app-questions-type";

const GameStatusSchema = z.enum(["draft", "published"]);

export const GameDetailsSchema = z.object({
    game: GameSchema,
    questions: z.array(QuestionSchema),
    created_at: z.string(), // date
    status: GameStatusSchema
})

export type GameStatus = z.infer<typeof GameStatusSchema>;

export type GameDetails = z.infer<typeof GameDetailsSchema>