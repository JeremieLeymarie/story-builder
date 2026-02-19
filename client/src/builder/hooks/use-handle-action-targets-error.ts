import { Action, Scene } from "@/lib/storage/domain";
import { makeInvalidTargetPercentageError } from "../builder-errors";
import { useBuilderContext } from "./use-builder-context";
import { useBuilderErrorStore } from "./use-builder-error-store";

export const useHandleActionTargetsError = () => {
  const [addOrReplaceError, maybeRemoveError] = useBuilderErrorStore(
    (state) => [state.addOrReplaceError, state.maybeRemoveError],
  );
  const { builderService } = useBuilderContext();

  /**
   * Check if an action's targets probabilities are valid.
   * If they are valid, try to remove an eventual existing building error
   * If they are not valid, add or replace the builder error
   * @param scene the scene to check
   * @param action the action to check
   */
  const handleActionTargetsError = (scene: Scene, action: Action) => {
    const areTargetsValid = builderService.checkActionTargetsValidity(action);

    const error = makeInvalidTargetPercentageError({ scene, action });
    if (!areTargetsValid) addOrReplaceError(error);
    else maybeRemoveError(error);
  };

  return handleActionTargetsError;
};
