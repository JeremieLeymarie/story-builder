import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import z from "zod";
import { Action, Scene } from "@/lib/storage/domain";
import { useBuilderContext } from "./use-builder-context";
import { useAutoSubmitForm } from "@/hooks/use-auto-submit-form";
import { useState } from "react";
import { useBuilderActions } from "./use-builder-actions";
import { makeGetSceneQueryOptions } from "./use-get-scene";
import { useQueryClient } from "@tanstack/react-query";

const formValuesToTargets = (values: RandomEventSchemaOutput) => {
  return Object.entries(values).map(([sceneKey, probability]) => ({
    sceneKey,
    probability,
  }));
};

const useRandomEventSchema = (setRootError: (err: string | null) => void) => {
  const { builderService } = useBuilderContext();
  const parseProbability = (val: string) => parseInt(val.replace("%", "")) || 0;

  const probabilityValue = z.preprocess(
    parseProbability,
    z.int().min(0).max(100),
  );

  const randomEventSchema = z
    .record(z.string(), probabilityValue)
    .superRefine((data) => {
      const isValid = builderService.checkActionTargetsValidity(
        formValuesToTargets(data),
      );
      if (isValid) setRootError(null);
      else setRootError("Target probabilities should add up to exactly 100%");
    });

  return randomEventSchema;
};

export type RandomEventSchemaInput = z.input<
  ReturnType<typeof useRandomEventSchema>
>;
export type RandomEventSchemaOutput = z.output<
  ReturnType<typeof useRandomEventSchema>
>;

export const useEditRandomEventForm = ({
  defaultValues,
  sourceScene,
  action,
}: {
  defaultValues: RandomEventSchemaInput;
  sourceScene: Scene;
  action: Action;
}) => {
  const [rootError, setRootError] = useState<string | null>(null);
  const schema = useRandomEventSchema(setRootError);
  const { updateScene } = useBuilderActions();
  const queryClient = useQueryClient();

  // TODO: validate on load
  const form = useForm<
    RandomEventSchemaInput,
    unknown,
    RandomEventSchemaOutput
  >({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = async (data: RandomEventSchemaOutput) => {
    console.log({ data });
    const targets = formValuesToTargets(data);
    const actions = sourceScene.actions.map((a) =>
      a.key === action.key ? { ...a, targets } : a,
    );
    await updateScene({ key: sourceScene.key, actions });
    const queryKey = makeGetSceneQueryOptions(sourceScene.key).queryKey;
    queryClient.invalidateQueries({ queryKey });
    // TODO: invalidate edges?
  };

  useAutoSubmitForm({
    form,
    onSubmit,
  });

  return { form, rootError };
};

export type EditStoryFormType = UseFormReturn<
  RandomEventSchemaInput,
  unknown,
  RandomEventSchemaOutput
>;
