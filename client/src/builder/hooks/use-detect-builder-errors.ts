import { BuilderServicePort } from "@/domains/builder/ports/builder-service-port";
import { Scene } from "@/lib/storage/domain";
import { useBuilderErrorStore } from "./use-builder-error-store";
import { makeInvalidTargetPercentageError } from "../builder-errors";

export const useDetectBuilderErrors = ({
  scenes,
  builderService,
}: {
  scenes: Scene[];
  builderService: BuilderServicePort;
}) => {
  const addOrReplaceError = useBuilderErrorStore(
    (state) => state.addOrReplaceError,
  );

  // This is a really naive implementation. We should make this async and probably use zod to do this instead
  scenes.forEach((scene) => {
    scene.actions.forEach((action) => {
      const isValid = builderService.checkActionTargetsValidity(action);

      if (!isValid)
        addOrReplaceError(makeInvalidTargetPercentageError({ scene, action }));
    });
  });
};
