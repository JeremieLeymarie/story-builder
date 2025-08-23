import { useTestStory } from "./use-test-story";
import { useRouter } from "@tanstack/react-router";
import { getBuilderService } from "@/get-builder-service";

type ToolbarProps = {
  storyKey: string;
  remoteStoryKey?: string;
};

export const useToolbar = ({ storyKey }: ToolbarProps) => {
  const { testStory } = useTestStory();
  const { navigate } = useRouter();

  const deleteStory = async () => {
    await getBuilderService().deleteStory(storyKey);
    navigate({ to: "/builder/stories" });
  };

  return {
    testStory,
    deleteStory,
  };
};
