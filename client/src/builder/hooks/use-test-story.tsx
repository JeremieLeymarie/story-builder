import { useCallback } from "react";
import { useBuilderContext } from "./use-builder-store";

export const useTestStory = () => {
  const { storyKey } = useBuilderContext();

  const testStory = useCallback(
    (sceneKey: string) => {
      window.open(`/game/test/${storyKey}/${sceneKey}`, "_blank");
    },
    [storyKey],
  );

  return { testStory };
};
