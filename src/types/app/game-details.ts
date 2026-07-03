import z from "zod";
import { GameSchema } from "./games";
import { QuestionSchema } from "./questions";


export const GameDetailsSchema = z.object({
    game: GameSchema,
    questions: z.array(QuestionSchema),
    created_at: z.date(),
})

export type GameDetails = z.infer<typeof GameDetailsSchema>