import { z } from "zod";
import { STORY_GENRES, STORY_TYPE } from "@/lib/storage/domain";

export const fullStorySchema = z.object({
  story: z.object(
    {
      description: z.string({ message: "Description is required" }),
      key: z.string({ message: "storyKey is required" }),
      firstSceneKey: z.string({ message: "FirstSceneKey is required" }),
      creationDate: z
        .string({ message: "creationDate is required" })
        .transform((val) => new Date(val)),
      publicationDate: z
        .string({ message: "publicationDate is required" })
        .transform((val) => new Date(val))
        .optional(),
      genres: z.array(z.enum(STORY_GENRES)),
      authorId: z.string().optional(),
      image: z.string().url({ message: "Image has to be a valid URL" }),
      type: z.enum(STORY_TYPE, {
        message: "Status has to be a valid Status",
      }),
      title: z.string({ message: "Title is required" }),
    },
    { message: "Story is required" },
  ),
  scenes: z.array(
    z.object({
      key: z.string({ message: "Key is required" }),
      storyKey: z.string({ message: "StoryKey is required" }),
      title: z.string({ message: "Title is required" }),
      content: z.string({ message: "Content is required" }),
      actions: z.array(
        z.object({
          text: z.string({ message: "Text is required" }),
          sceneKey: z.string().optional(),
        }),
      ),
      builderParams: z.object({
        position: z.object({
          x: z.number({ message: "X is required" }),
          y: z.number({ message: "Y is required" }),
        }),
      }),
    }),
    { message: "Scenes are required" },
  ),
});
