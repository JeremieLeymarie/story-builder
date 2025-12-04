import { lexicalContentSchema } from "@/lib/lexical-content";
import { hexColorValidator } from "@/lib/validation";
import z from "zod";

export const articleSchema = z.object({
  title: z
    .string()
    .max(250, { error: "Title has to be less than 250 characters" }),
  content: lexicalContentSchema,
  image: z.url(),
  categoryKey: z.nanoid().nullish(),
});

export type ArticleSchema = z.infer<typeof articleSchema>;

export const categorySchema = z.object({
  name: z
    .string()
    .max(250, { error: "Name has to be less than 250 characters" }),
  color: hexColorValidator,
});

export type CategorySchema = z.infer<typeof categorySchema>;
