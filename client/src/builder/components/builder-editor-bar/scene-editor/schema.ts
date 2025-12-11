import { lexicalContentSchema } from "@/lib/lexical-content";
import { Scene } from "@/lib/storage/domain";
import * as z from "zod/v4";

const actionBase = z.object({
  text: z.string({ message: "Text is required" }),
  sceneKey: z.nanoid().optional(),
});

const actionSchema = z.discriminatedUnion("showCondition", [
  actionBase.extend({ showCondition: z.literal("always") }),
  actionBase.extend({
    showCondition: z.literal("when-user-did-visit"),
    targetSceneKey: z.nanoid(),
  }),
  actionBase.extend({
    showCondition: z.literal("when-user-did-not-visit"),
    targetSceneKey: z.nanoid(),
  }),
]);

export type SceneEditorActionSchema = z.infer<typeof actionSchema>;

export const sceneSchema = z.object({
  title: z
    .string()
    .max(250, { message: "Title has to be less than 250 characters" }),
  content: lexicalContentSchema,
  actions: z.array(actionSchema),
});

export type SceneSchema = z.infer<typeof sceneSchema>;

export type SceneUpdatePayload = Omit<Scene, "builderParams">;
