import { useTestStory } from "./use-test-story";
import { useSynchronizeBuilder } from "./use-synchronize-builder";

type ToolbarProps = {
  storyKey: string;
  remoteStoryKey?: string;
};

export const useToolbar = ({ storyKey }: ToolbarProps) => {
  const { testStory } = useTestStory({ storyKey });
  const { synchronize, isAuthModalOpen, setIsAuthModalOpen } =
    useSynchronizeBuilder({ storyKey });

  return {
    testStory,
    synchronize,
    isAuthModalOpen,
    setIsAuthModalOpen,
  };
};
