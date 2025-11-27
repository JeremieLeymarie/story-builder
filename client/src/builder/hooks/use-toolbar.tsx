import { useTestStory } from "./use-test-story";
import { useAddScene } from "./use-add-scene";
import { useBuilderEditorStore } from "./use-scene-editor-store";
import { useState } from "react";

export const useToolbarActions = () => {
  const { testStory } = useTestStory();
  const { addScene } = useAddScene();
  const openBuilderEditor = useBuilderEditorStore((state) => state.open);

  return {
    testStory,
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
