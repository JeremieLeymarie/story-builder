import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import z from "zod";
import { Action, Scene } from "@/lib/storage/domain";
import { useBuilderActions } from "./use-builder-actions";
import { useBuilderContext } from "./use-builder-context";
import { useBuilderErrorStore } from "./use-builder-error-store";
import { makeInvalidTargetPercentageError } from "../builder-errors";

const probabilitySchema = z.int().min(0).max(100);

export const parseProbability = (val: string) =>
  parseInt(val.replace("%", "")) || 0;

const probabilityValue = z
  .string()
  .refine((val) => probabilitySchema.safeParse(parseProbability(val)).success, {
    error: "La probabilité doit être entre 0 et 100",
  });

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
  updateTargetProbability,
}: {
  defaultValues: RandomEventSchema;
  sourceScene: Scene;
  action: Action;
  updateTargetProbability: ReturnType<
    typeof useBuilderActions
  >["updateTargetProbability"];
}) => {
  const { builderService } = useBuilderContext();
  const [addOrReplaceError, maybeRemoveError] = useBuilderErrorStore(
    (state) => [state.addOrReplaceError, state.maybeRemoveError],
  );

  const form = useForm<RandomEventSchema>({
    resolver: zodResolver(randomEventSchema),
    defaultValues,
    mode: "onChange",
  });

  const handleProbabilityBlur = async (
    targetSceneKey: string,
    value: string,
  ) => {
    const newProbability = parseProbability(value);
    if (!probabilitySchema.safeParse(newProbability).success) return;

    const updated = await updateTargetProbability({
      sourceSceneKey: sourceScene.key,
      actionKey: action.key,
      targetSceneKey,
      probability: newProbability,
    });

    if (!updated) return;

    const updatedAction = updated.actions.find((a) => a.key === action.key);
    if (!updatedAction) return;

    const areTargetsValid =
      builderService.checkActionTargetsValidity(updatedAction);
    const error = makeInvalidTargetPercentageError({
      scene: updated,
      action: updatedAction,
    });
    if (!areTargetsValid) addOrReplaceError(error);
    else maybeRemoveError(error);
  };

  return { form, handleProbabilityBlur };
};

export type EditStoryFormType = UseFormReturn<RandomEventSchema>;
