import { lexicalContentSchema } from "@/lib/lexical-content";
import { Scene } from "@/lib/storage/domain";
import * as z from "zod/v4";

export const sceneSchema = z.object({
  title: z
    .string()
    .max(250, { message: "Title has to be less than 250 characters" }),
  content: lexicalContentSchema,
  actions: z.array(
    z.object({
      text: z.string(),
      sceneKey: z.string().optional(),
    }),
  ),
});

export type SceneSchema = z.infer<typeof sceneSchema>;

export type SceneUpdatePayload = Omit<Scene, "builderParams">;
