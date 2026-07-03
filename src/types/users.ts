import { z } from "zod";

const UserSchema = z.object({
    id: z.number(),
    email: z.string().email(),
    name: z.string(),
    role: z.enum(["ADMIN", "SUPER_ADMIN", "LMS", "APP"]),
    avatar: z.string().optional(),
    isVerified: z.boolean(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UserTokenSchema = z.object({
    accessToken: z.string().jwt(),
    expires_in: z.number().int().positive(),
    user: UserSchema,
    profileCompleted: z.boolean(),
});

export type User = z.infer<typeof UserSchema>;
export type UserToken = z.infer<typeof UserTokenSchema>;