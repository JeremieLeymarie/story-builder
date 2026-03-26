import { useBuilderContext } from "@/builder/hooks/use-builder-context";
import { useAutoSubmitForm } from "@/hooks/use-auto-submit-form";
import { CharacterConfiguration } from "@/lib/storage/domain";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";

const sideEffectSchema = z.object({
  key: z.nanoid(),
  name: z.string(),
  trigger: z.literal("scene-load"),
  isVisible: z.boolean(),
  effect: z.object({
    type: z.literal("character-attribute"),
    operation: z.union([z.literal("add"), z.literal("retrieve")]),
    value: z.int(),
    attributeKey: z.nanoid(),
    title: z.string().optional(),
    description: z.string().optional(),
  }),
});

const schema = z.object({
  effects: z.array(sideEffectSchema),
});

export const useSideEffectsForm = ({
  characterConfig,
}: {
  characterConfig: CharacterConfiguration;
}) => {
  const form = useForm({ resolver: zodResolver(schema) });
  const { builderService } = useBuilderContext();

  const { fields, append, remove, update } = useFieldArray({
    name: "effects",
    control: form.control,
  });

  useAutoSubmitForm({
    form,
    onSubmit: (data) => {
      console.log(data);
    },
  });

  const addEffect = () => {
    const newEffect = builderService.makeEmptySideEffectPayload({
      characterConfig,
    });

    append({
      key: newEffect.key,
      name: newEffect.name,
      isVisible: newEffect.isVisible,
      trigger: newEffect.trigger,
      effect: {
        type: newEffect.effect.type,
        attributeKey: newEffect.effect.attributeKey,
        operation: newEffect.effect.increment >= 0 ? "add" : "retrieve",
        value: Math.abs(newEffect.effect.increment),
        title: newEffect.effect.title,
        description: newEffect.effect.description,
      },
    });
  };

  return {
    form,
    fields,
    addEffect,
    removeEffect: remove,
    updateEffect: update,
  };
};

export type SideEffectsSchema = z.output<typeof schema>;
