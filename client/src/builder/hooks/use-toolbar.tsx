import { useTestStory } from "./use-test-story";
import { useRouter } from "@tanstack/react-router";
import { getBuilderService } from "@/get-builder-service";
import { useBuilderContext } from "./use-builder-context";
import { useAddScene } from "./use-add-scene";
import { useBuilderEditorStore } from "./use-scene-editor-store";
import { useState } from "react";

export const useToolbarActions = () => {
  const { testStory } = useTestStory();
  const { navigate } = useRouter();
  const { story } = useBuilderContext();
  const { addScene } = useAddScene();
  const openBuilderEditor = useBuilderEditorStore((state) => state.open);

  const deleteStory = async () => {
    await getBuilderService().deleteStory(story.key);
    navigate({ to: "/builder/stories" });
  };

  return {
    testStory,
    deleteStory,
    addScene,
    openBuilderEditor,
  };
};

export const useToolbar = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return {
    isExpanded,
    toggleExpanded: () => setIsExpanded((prev) => !prev),
  };
};
