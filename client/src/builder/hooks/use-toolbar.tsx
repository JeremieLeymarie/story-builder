import { useTestStory } from "./use-test-story";
import { useSynchronizeBuilder } from "./use-synchronize-builder";

type ToolbarProps = {
  storyId: number;
};

export const useToolbar = ({ storyId }: ToolbarProps) => {
  const testProps = useTestStory({ storyId });
  const synchronizeProps = useSynchronizeBuilder({ storyId });

  return { ...testProps, ...synchronizeProps };
};
