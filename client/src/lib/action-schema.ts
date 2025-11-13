import z from "zod";

export const baseActionSchema = z.object({
  text: z.string({ message: "Text is required" }),
  sceneKey: z.nanoid().optional(),
});

export const actionSchema = z.discriminatedUnion("type", [
  baseActionSchema.extend({
    type: z.literal("simple"),
  }),
  baseActionSchema.extend({
    type: z.literal("conditional"),
    condition: z.object({
      type: z.enum(["user-did-visit", "user-did-not-visit"]),
      sceneKey: z.nanoid(),
    }),
  }),
]);
