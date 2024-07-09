import { useTestStory } from "./use-test-story";
import { useSynchronizeBuilder } from "./use-synchronize-builder";

type ToolbarProps = {
  storyId: number;
  remoteStoryId?: string;
};

export const useToolbar = ({ storyId }: ToolbarProps) => {
  const { testStory } = useTestStory({ storyId });
  const { synchronize, isAuthModalOpen, setIsAuthModalOpen } =
    useSynchronizeBuilder({ storyId });

  return {
    testStory,
    synchronize,
    isAuthModalOpen,
    setIsAuthModalOpen,
  };
};
