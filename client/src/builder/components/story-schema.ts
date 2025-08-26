import { STORY_TYPE, STORY_GENRES } from "@/lib/storage/domain";
import { z } from "zod";

export const storySchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters long" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" }),
  image: z.url({ message: "Image has to be a valid URL" }),
  status: z.enum(STORY_TYPE).optional(),
  genres: z.array(z.enum(STORY_GENRES)),
  firstSceneKey: z.string().optional(),
});

export type StorySchema = z.infer<typeof storySchema>;
