import { useCallback } from "react";

export const useTestStory = ({ storyId }: { storyId: number }) => {
  const testStory = useCallback(() => {
    /**
     * Maybe at some point this should create a storyProgress object to keep track of previous choices,
     * inventory, and all future features
     */
    window.open(`/game/${storyId}`, "_blank");
  }, [storyId]);

  return { testStory };
};
