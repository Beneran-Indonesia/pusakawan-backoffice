import { z } from "zod";

const GameStatusSchema = z.enum(["draft", "published"]);

export const GameSchema = z.object({
    id: z.string(),
    title: z.string().max(100),
    status: GameStatusSchema,
    banner: z.string().url(),
    description: z.string().max(500),
    rules: z.array(z.string().max(50)).max(5),
    held_on: z.object({
        start_date: z.coerce.date(),
        end_date: z.coerce.date(),
    }),
    time_range: z.object({
        start_time: z.coerce.date(),
        end_time: z.coerce.date(),
    }),
    diversity_points: z.boolean(),
    group_size: z.object({
        minimum_participants: z.number().int().min(1).max(100),
        maximum_participants: z.number().int().min(2).max(100),
    }),
    is_offline: z.boolean(), // online or offline
    is_linear_flow: z.boolean(), // linear or non-linear
    is_correct_authentication: z.boolean(), // correct / both authentication
    is_automatic_start: z.boolean(), // automaic / manual start
}).superRefine((game, ctx) => {
    if (game.held_on.end_date < game.held_on.start_date) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["held_on", "end_date"],
            message: "End date must be after start date",
        });
    }

    if (game.time_range.end_time < game.time_range.start_time) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["time_range", "end_time"],
            message: "End time must be after start time",
        });
    }

    if (game.group_size.maximum_participants < game.group_size.minimum_participants) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["minimum_participants", "maximum_participants"],
            message: "Maximum members must be more than minimum members",
        })
    }
});

export type Game = z.infer<typeof GameSchema>;