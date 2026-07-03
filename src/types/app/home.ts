import { z } from "zod";

const PostStatusSchema = z.enum(["draft", "published"]);

const PostSchema = z.object({
    status: PostStatusSchema,
    thumbnail: z.string().url(),
    description: z.string(),
    published_by: z.string(),
    pictures: z.array(z.string().url()).max(10),
    created_at: z.coerce.date(),
    published_at: z.coerce.date().nullable(),
    edited_at: z.coerce.date().nullable(),
});

export type PostStatus = z.infer<typeof PostStatusSchema>;
export type Post = z.infer<typeof PostSchema>;