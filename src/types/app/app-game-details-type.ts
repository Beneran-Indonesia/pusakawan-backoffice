import z from "zod";
import { GameSchema } from "./app-games-type";
import { QuestionSchema } from "./app-questions-type";


export const GameDetailsSchema = z.object({
    game: GameSchema,
    questions: z.array(QuestionSchema),
    created_at: z.date(),
})

export type GameDetails = z.infer<typeof GameDetailsSchema>