import z from "zod";

const baseActionSchema = z.object({
  key: z.nanoid(),
  text: z.string({ message: "Text is required" }),
  targets: z
    .array(z.object({ sceneKey: z.nanoid(), probability: z.number() }))
    .refine(
      (values) => {
        const totalProbabilities = values.reduce(
          (acc, v) => acc + v.probability,
          0,
        );

        return totalProbabilities > 0;
      },
      { error: "All targets of an action must add up to at least 1%" },
    ),
});

const sceneVisitCondition = z.object({
  type: z.enum(["user-did-visit", "user-did-not-visit"]),
  sceneKey: z.nanoid(),
});

const characterAttributeCondition = z.object({
  type: z.literal("character-attribute"),
  attributeKey: z.nanoid(),
  comparator: z.union([z.literal("lower-than"), z.literal("greater-than")]),
  value: z.int(),
});

export const actionSchema = z.discriminatedUnion("type", [
  baseActionSchema.extend({
    type: z.literal("simple"),
  }),
  baseActionSchema.extend({
    type: z.literal("conditional"),
    condition: z.discriminatedUnion("type", [
      sceneVisitCondition,
      characterAttributeCondition,
    ]),
  }),
]);
