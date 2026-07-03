import { z } from "zod";

const PostStatusSchema = z.enum(["draft", "published"]);

const PostSchema = z.object({
    id: z.string(),
    status: PostStatusSchema,
    thumbnail: z.string().url(),
    description: z.string(),
    author: z.string(),
    // pictures: z.array(z.string().url()).max(10),
    timestamp: z.string(),
    // created_at: z.string(),
    published_at: z.string().nullable().optional(),
    edited_at: z.string().nullable().optional(),
});

export type PostStatus = z.infer<typeof PostStatusSchema>;
export type Post = z.infer<typeof PostSchema>;