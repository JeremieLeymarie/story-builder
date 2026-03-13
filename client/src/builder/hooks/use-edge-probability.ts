import { toast } from "sonner";
import z from "zod";
import { useBuilderContext } from "./use-builder-context";
import { useErrorToast } from "./use-error-toast";
import { FocusEvent, useState } from "react";
import { EdgeProps } from "@xyflow/react";
import { BuilderEdge } from "../types";
import { useQueryClient } from "@tanstack/react-query";
import { makeGetSceneQueryOptions } from "./use-get-scene";
import { useBuilderErrorStore } from "./use-builder-error-store";
import { useProbabilityMask } from "./use-probability-mask";
import { useHandleActionTargetsError } from "./use-handle-action-targets-error";

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
  const inputRef = useProbabilityMask();
  const [isFocused, setIsFocused] = useState(false);

  const { builderService } = useBuilderContext();
  const { handleError } = useErrorToast();
  const hasError = useBuilderErrorStore((state) =>
    state.hasError("invalid-action-target-percentages", sourceHandleId),
  );
  const handleActionError = useHandleActionTargetsError();
  const queryClient = useQueryClient();

  const [validationError, setValidationError] = useState<string | null>(null);

  const onChange = (e: FocusEvent) => {
    const val = parseInt((e.target as HTMLInputElement).value);
    const parsed = schema.safeParse(val);
    if (parsed.error) {
      const message =
        "Invalid value: only values between 0 and 100 are allowed";
      setValidationError(message);
      toast.error(message);
    } else {
      setValidationError(null);
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

          handleActionError(scene, action);

          // Invalidate scene queries used in builder editor
          const queryKey = makeGetSceneQueryOptions(source).queryKey;
          queryClient.invalidateQueries({ queryKey });
        })
        .catch(handleError);
      setValue(val);
    }
    setIsFocused(false);
  };

  return {
    onChange,
    value,
    inputRef,
    isFocused,
    setIsFocused,
    hasError,
    validationError,
  };
};
