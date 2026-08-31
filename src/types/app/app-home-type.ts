import { z } from "zod";
import { BasicUserSchema } from "../users-type";
import type { useTranslate } from "@refinedev/core";

// Error validation uses localization.
type Translate = ReturnType<typeof useTranslate>;

const PostStatusSchema = z.enum(["draft", "published"]);

export const PostSchema = (t: Translate) => z.object({
  id: z.string().readonly(),
  status: PostStatusSchema,
  pictures: z.array(z.string().url()).min(1, t("app.home.errors.pictures.min")).max(10, t("app.home.errors.pictures.max")),
  description: z.string().min(1, t("app.home.errors.description")),
  author: BasicUserSchema,
  created_at: z.string(),
  published_at: z.string().nullable().optional(),
  edited_at: z.string().nullable().optional(),
});

export type PostStatus = z.infer<typeof PostStatusSchema>;
export type Post = z.infer<ReturnType<typeof PostSchema>>;
