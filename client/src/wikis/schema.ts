import { lexicalContentSchema } from "@/lib/lexical-content";
import z from "zod";

export const articleSchema = z.object({
  title: z
    .string()
    .max(250, { error: "Title has to be less than 250 characters" }),
  content: lexicalContentSchema,
  image: z.url(),
  categoryKey: z.nanoid().optional(),
});

export type ArticleSchema = z.infer<typeof articleSchema>;
