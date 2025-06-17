import { useCallback } from "react";
import { useBuilderContext } from "./use-builder-store";

export const useTestStory = () => {
  const { story } = useBuilderContext();

  const testStory = useCallback(
    (sceneKey: string) => {
      window.open(`/game/test/${story.key}/${sceneKey}`, "_blank");
    },
    [story.key],
  );

  return { testStory };
};
