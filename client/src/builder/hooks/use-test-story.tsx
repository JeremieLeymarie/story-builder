import { useCallback } from "react";

export const useTestStory = ({ storyKey }: { storyKey: string }) => {
  const testStory = useCallback(() => {
    /**
     * Maybe at some point this should create a storyProgress object to keep track of previous choices,
     * inventory, and all future features
     */
    window.open(`/game/${storyKey}`, "_blank"); // TODO: this is broken
  }, [storyKey]);

  return { testStory };
};
