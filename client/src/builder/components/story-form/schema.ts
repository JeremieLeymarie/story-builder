import { STORY_GENRES, STORY_STATUS } from "@/lib/storage/dexie/dexie-db";
import { z } from "zod";

export const schema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters long" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" }),
  image: z.string().url({ message: "Image has to be a valid URL" }),
  status: z.enum(STORY_STATUS).optional(),
  genres: z.array(z.enum(STORY_GENRES)),
});

export type Schema = z.infer<typeof schema>;
