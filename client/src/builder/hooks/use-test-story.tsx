import { useCallback } from "react";

export const useTestStory = ({ storyKey }: { storyKey: string }) => {
  const testStory = useCallback(
    (sceneKey: string) => {
      window.open(`/game/test/${storyKey}/${sceneKey}`, "_blank");
    },
    [storyKey],
  );

  return { testStory };
};
