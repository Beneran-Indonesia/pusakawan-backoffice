import { z } from "zod";

export const GameStatusSchema = z.enum(["draft", "published"]);
export const GameSchema = z
  .object({
    id: z.string().readonly(),
    author: z.string(),
    status: GameStatusSchema,
    title: z.string().max(100),
    banner: z.string().url(),
    description: z.string().max(500),
    rules: z.array(z.string().max(200)).max(5).optional(),
    held_on: z.object({
      start_datetime: z.string(), // date time
      end_datetime: z.string(), // date time
    }),

    is_offline: z.boolean(),
    diversity_points: z.boolean(),
    group_size: z.object({
      minimum_participants: z.number().int().min(1).max(100),
      maximum_participants: z.number().int().min(2).max(100),
    }),
    is_linear_flow: z.boolean(), // linear or non-linear
    is_correct_authentication: z.boolean(), // correct / both authentication
    is_automatic_start: z.boolean(), // automatic / manual start
  })
  .superRefine((game, ctx) => {
    if (game.held_on.end_datetime < game.held_on.start_datetime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["held_on", "end_datetime"],
        message: "End datetime must be after start datetime",
      });
    }

    if (
      game.group_size.maximum_participants <
      game.group_size.minimum_participants
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["minimum_participants", "maximum_participants"],
        message: "Maximum members must be more than minimum members",
      });
    }
  });
export type GameStatus = z.infer<typeof GameStatusSchema>;

export type Game = z.infer<typeof GameSchema>;
