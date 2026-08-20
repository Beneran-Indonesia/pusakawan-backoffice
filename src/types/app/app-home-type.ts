import { z } from "zod";

const PostStatusSchema = z.enum(["draft", "published"]);

export const PostSchema = z.object({
  id: z.string(),
  status: PostStatusSchema,
  pictures: z.array(z.string().url()).min(1).max(10),
  description: z.string().min(1),
  author: z.string(),
  created_at: z.string(),
  published_at: z.string().nullable().optional(),
  edited_at: z.string().nullable().optional(),
});

export type PostStatus = z.infer<typeof PostStatusSchema>;
export type Post = z.infer<typeof PostSchema>;
