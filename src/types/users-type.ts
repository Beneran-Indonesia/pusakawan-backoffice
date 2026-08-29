import { z } from "zod";

export const BasicUserSchema = z.object({
    name: z.string(),
    email: z.string().email().readonly(),
    role: z.enum(["ADMIN", "SUPER_ADMIN", "LMS", "APP"]).readonly(),
    avatar: z.string().optional(), // s3 url
})

export const UserSchema = z.object({
    id: z.number().readonly(),
    ...BasicUserSchema.shape,
    gender: z.enum(["FEMALE", "MALE"]),
    birthdate: z.string(), // date object
    institution: z.string(),
    phone: z.string(),
    isVerified: z.boolean(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UserTokenSchema = z.object({
    accessToken: z.string().jwt(),
    expiresIn: z.number().int().positive(),
    user: BasicUserSchema,
    profileCompleted: z.boolean(),
});

export type CreatedBy = z.infer<typeof BasicUserSchema>;
export type User = z.infer<typeof UserSchema>;
export type UserToken = z.infer<typeof UserTokenSchema>;