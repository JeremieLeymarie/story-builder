import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import z from "zod";
import { Action, Scene } from "@/lib/storage/domain";
import { useBuilderActions } from "./use-builder-actions";
import { useBuilderContext } from "./use-builder-context";
import { useBuilderErrorStore } from "./use-builder-error-store";
import { makeInvalidTargetPercentageError } from "../builder-errors";
import { useQueryClient } from "@tanstack/react-query";
import { makeGetSceneQueryOptions } from "./use-get-scene";

const probabilitySchema = z.int().min(0).max(100);

const parseProbability = (val: string) => parseInt(val.replace("%", "")) || 0;

const probabilityValue = z.string().refine(
  (val) => probabilitySchema.safeParse(parseProbability(val)).success,
  { error: "La probabilité doit être entre 0 et 100" },
);

export const randomEventSchema = z
  .record(z.string(), probabilityValue)
  .refine(
    (data) =>
      Object.values(data).reduce((sum, v) => sum + parseProbability(v), 0) ===
      100,
    { error: "Le total des probabilités doit être égal à 100%" },
  );

export type RandomEventSchema = z.input<typeof randomEventSchema>;

export const useEditRandomEventForm = ({
  defaultValues,
  sourceScene,
  action,
  updateScene,
}: {
  defaultValues: RandomEventSchema;
  sourceScene: Scene;
  action: Action;
  updateScene: ReturnType<typeof useBuilderActions>["updateScene"];
}) => {
  const { builderService } = useBuilderContext();
  const [addOrReplaceError, maybeRemoveError] = useBuilderErrorStore(
    (state) => [state.addOrReplaceError, state.maybeRemoveError],
  );
  const queryClient = useQueryClient();

  const form = useForm<RandomEventSchema>({
    resolver: zodResolver(randomEventSchema),
    defaultValues,
    mode: "onChange",
  });

  const handleProbabilityBlur = (targetSceneKey: string, value: string) => {
    const newProbability = parseProbability(value);
    if (!probabilitySchema.safeParse(newProbability).success) return;

    updateScene({
      key: sourceScene.key,
      actions: sourceScene.actions.map((sceneAction) =>
        sceneAction.key === action.key
          ? {
              ...sceneAction,
              targets: sceneAction.targets.map((t) =>
                t.sceneKey === targetSceneKey
                  ? { ...t, probability: newProbability }
                  : t,
              ),
            }
          : sceneAction,
      ),
    });

    // Update builder error store so edges reflect the error
    const updatedAction = {
      ...action,
      targets: action.targets.map((t) =>
        t.sceneKey === targetSceneKey
          ? { ...t, probability: newProbability }
          : t,
      ),
    };
    const areTargetsValid =
      builderService.checkActionTargetsValidity(updatedAction);
    const error = makeInvalidTargetPercentageError({
      scene: sourceScene,
      action: updatedAction,
    });
    if (!areTargetsValid) addOrReplaceError(error);
    else maybeRemoveError(error);

    // Invalidate scene queries used in builder editor
    const queryKey = makeGetSceneQueryOptions(sourceScene.key).queryKey;
    queryClient.invalidateQueries({ queryKey });
  };

  return { form, handleProbabilityBlur };
};

export type EditStoryFormType = UseFormReturn<RandomEventSchema>;
