import { useBuilderContext } from "./use-builder-context";

export const useTestStory = () => {
  const { story } = useBuilderContext();

  const testStory = (sceneKey: string) => {
    window.open(`/game/test/${story.key}/${sceneKey}`, "_blank");
  };

  return { testStory };
};
