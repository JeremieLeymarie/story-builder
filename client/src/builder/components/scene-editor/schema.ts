import * as z from "zod/v4";

export const sceneSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title has to be at least 2 characters" })
    .max(50, { message: "Title has to be less than 50 characters" }),
  content: z
    .string()
    .min(10, { message: "Content has to be at least 10 characters" })
    .max(8000, { message: "Content has to be less than 10 000 characters" }),
  actions: z.array(
    z.object({
      text: z
        .string()
        .min(3, { message: "Action text has to be at least 3 characters" }),
      sceneKey: z.string().optional(),
    }),
  ),
});

export type SceneSchema = z.infer<typeof sceneSchema>;
