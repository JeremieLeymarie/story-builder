import { useBuilderErrorStore } from "./use-builder-error-store";
import { makeInvalidTargetPercentageError } from "../builder-errors";
import { useBuilderContext } from "./use-builder-context";
import { useGetBuilder } from "./use-get-builder";
import { useEffect } from "react";

export const useDetectBuilderErrors = () => {
  const { builderService, story } = useBuilderContext();
  const addOrReplaceError = useBuilderErrorStore(
    (state) => state.addOrReplaceError,
  );

  const { scenes } = useGetBuilder({ storyKey: story.key });

  useEffect(() => {
    if (!scenes) return;

    // This is a really naive implementation. We should make this async and probably use zod to do this instead
    scenes.forEach((scene) => {
      scene.actions.forEach((action) => {
        const isValid = builderService.checkActionTargetsValidity(action);

        if (!isValid)
          addOrReplaceError(
            makeInvalidTargetPercentageError({ scene, action }),
          );
      });
    });
  }, [addOrReplaceError, builderService, scenes]);
};
