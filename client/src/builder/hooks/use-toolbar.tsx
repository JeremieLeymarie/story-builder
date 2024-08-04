import { useTestStory } from "./use-test-story";

type ToolbarProps = {
  storyKey: string;
  remoteStoryKey?: string;
};

export const useToolbar = ({ storyKey }: ToolbarProps) => {
  const { testStory } = useTestStory({ storyKey });

  return {
    testStory,
  };
};
