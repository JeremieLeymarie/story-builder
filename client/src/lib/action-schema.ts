import z from "zod";

const baseActionSchema = z.object({
  key: z.nanoid(),
  text: z.string({ message: "Text is required" }),
  targets: z
    .array(z.object({ sceneKey: z.nanoid(), probability: z.number() }))
    .refine((values) => {
      const totalProbabilities = values.reduce(
        (acc, v) => acc + v.probability,
        0,
      );

      return totalProbabilities > 0;
    }),
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
