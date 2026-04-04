import { useBuilderContext } from "@/builder/hooks/use-builder-context";
import { useErrorToast } from "@/builder/hooks/use-error-toast";
import { makeGetSceneQueryOptions } from "@/builder/hooks/use-get-scene";
import { useAutoSubmitForm } from "@/hooks/use-auto-submit-form";
import {
  CharacterConfiguration,
  Scene,
  SideEffect,
} from "@/lib/storage/domain";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { match } from "ts-pattern";
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

type SideEffectSchema = z.infer<typeof sideEffectSchema>;

// The form schema `SideEffectSchema` has a slightly different shape from the domain type `SideEffect`.
// The form uses operation + value to determine to what value is added/retrieved
// whereas the domain only stores an `increment` value which can be positive or negative
// So we need to adapt from one format to the other

const adaptDomainSideEffect = (sideEffectConfig: SideEffect) =>
  ({
    key: sideEffectConfig.key,
    name: sideEffectConfig.name,
    isVisible: sideEffectConfig.isVisible,
    trigger: sideEffectConfig.trigger,
    effect: {
      type: sideEffectConfig.effect.type,
      attributeKey: sideEffectConfig.effect.attributeKey,
      operation: sideEffectConfig.effect.increment >= 0 ? "add" : "retrieve",
      value: Math.abs(sideEffectConfig.effect.increment),
      title: sideEffectConfig.effect.title,
      description: sideEffectConfig.effect.description,
    },
  }) satisfies SideEffectSchema;

const adaptFormSideEffect = (sideEffectValue: SideEffectSchema) =>
  ({
    key: sideEffectValue.key,
    name: sideEffectValue.name,
    isVisible: sideEffectValue.isVisible,
    trigger: sideEffectValue.trigger,
    effect: {
      type: sideEffectValue.effect.type,
      attributeKey: sideEffectValue.effect.attributeKey,
      increment: match(sideEffectValue.effect.operation)
        .with("add", () => +sideEffectValue.effect.value)
        .with("retrieve", () => -sideEffectValue.effect.value)
        .exhaustive(),
      title: sideEffectValue.effect.title,
      description: sideEffectValue.effect.description,
    },
  }) satisfies SideEffect;

export const useSideEffectsForm = ({
  scene,
  characterConfig,
}: {
  scene: Scene;
  characterConfig: CharacterConfiguration;
}) => {
  const form = useForm({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      effects: scene.sideEffects?.map(adaptDomainSideEffect) ?? [],
    },
  });
  const { builderService } = useBuilderContext();
  const { handleError } = useErrorToast();
  const queryClient = useQueryClient();

  const { mutateAsync: saveChanges } = useMutation({
    mutationFn: async (sideEffects: SideEffect[]) => {
      await builderService.saveSideEffects({
        sceneKey: scene.key,
        sideEffects,
      });
    },
    onError: handleError,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: makeGetSceneQueryOptions(scene.key).queryKey,
      });
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "effects",
    control: form.control,
  });

  const { maybeSubmit, isSaving } = useAutoSubmitForm({
    form,
    onSubmit: ({ effects }) => saveChanges(effects.map(adaptFormSideEffect)),
  });

  useEffect(() => {
    // This a HORRIBLE workaround to manage the fact that form.formState.dirtyFields is not up-to-date on the first fieldArray.append if it is not accessed here first
    // I think we can allow this for now since it should be fixed in the next RHF version, which will be compatible with the React Compiler
    if (Object.keys(form.formState.dirtyFields).length > 0) maybeSubmit();
  }, [form.formState.dirtyFields, maybeSubmit]);

  const addEffect = () => {
    const newEffect = builderService.makeEmptySideEffectPayload({
      characterConfig,
    });

    append(adaptDomainSideEffect(newEffect));
  };

  return {
    form,
    fields,
    addEffect,
    removeEffect: remove,
    isSaving,
  };
};

export type SideEffectsSchema = z.output<typeof schema>;
