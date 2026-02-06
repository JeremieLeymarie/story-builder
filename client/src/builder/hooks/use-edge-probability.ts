import { MaskitoOptions } from "@maskito/core";
import {
  maskitoCaretGuard,
  maskitoPostfixPostprocessorGenerator,
} from "@maskito/kit";
import { toast } from "sonner";
import z from "zod";
import { useBuilderContext } from "./use-builder-context";
import { useErrorToast } from "./use-error-toast";
import { FocusEvent, useState } from "react";
import { useMaskito } from "@maskito/react";
import { EdgeProps } from "@xyflow/react";
import { BuilderEdge } from "../types";
import {
  InvalidActionTargetPercentagesError,
  useBuilderErrorStore,
} from "./use-builder-error-store";

const percentMask = {
  mask: /([0-9]{0,3})/,
  postprocessors: [maskitoPostfixPostprocessorGenerator("%")],
  plugins: [
    // First item = min index for caret, last item = max index
    maskitoCaretGuard((value) => [0, value.length - 1]),
  ],
} satisfies MaskitoOptions;

const schema = z.int().min(0).max(100);

export const useEdgeProbability = ({
  id,
  data,
  source,
  sourceHandleId,
  target,
}: Pick<
  EdgeProps<BuilderEdge>,
  "data" | "source" | "sourceHandleId" | "target" | "id"
>) => {
  if (!sourceHandleId) throw new Error(`Edge with no source handle: ${id}`);
  const [value, setValue] = useState(data?.probability ?? 0);
  const inputRef = useMaskito({ options: percentMask });
  const [isFocused, setIsFocused] = useState(false);

  const { builderService } = useBuilderContext();
  const { handleError } = useErrorToast();
  const [addOrReplaceError, maybeRemoveError, hasError] = useBuilderErrorStore(
    (state) => [
      state.addOrReplaceError,
      state.maybeRemoveError,
      state.hasError("invalid-action-target-percentages", sourceHandleId),
    ],
  );

  const onChange = (e: FocusEvent) => {
    const val = parseInt((e.target as HTMLInputElement).value);
    const parsed = schema.safeParse(val);
    if (parsed.error) {
      toast.error("Invalid value: only values between 0 and 100 are allowed");
    } else {
      builderService
        .updateTargetProbability({
          sourceSceneKey: source,
          actionKey: sourceHandleId,
          targetSceneKey: target,
          probability: val,
        })
        .then((scene) => {
          const action = scene.actions.find((a) => a.key === sourceHandleId);
          if (!action)
            throw new Error(`Action not found for handle: ${sourceHandleId}`);

          const areTargetsValid =
            builderService.checkActionTargetsValidity(action);
          const error = {
            type: "invalid-action-target-percentages",
            id: action.key,
            payload: {
              sourceSceneKey: scene.key,
              sceneName: scene.title,
              actionText: action.text,
              probabilityTotal: action.targets.reduce(
                (acc, target) => acc + target.probability,
                0,
              ),
              targetSceneKeys: action.targets.map(({ sceneKey }) => sceneKey),
            },
          } satisfies InvalidActionTargetPercentagesError;
          if (!areTargetsValid) addOrReplaceError(error);
          else maybeRemoveError(error);
        })
        .catch(handleError);
      setValue(val);
    }
    setIsFocused(false);
  };

  return { onChange, value, inputRef, isFocused, setIsFocused, hasError };
};
