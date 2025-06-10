import { useCallback, useEffect } from "react";
import { useAddSceneEditorStore } from "./use-add-scene-editor-store";
import { useTestStory } from "./use-test-story";

export const useBuilderShortCuts = ({
  firstSceneKey,
}: {
  firstSceneKey: string;
}) => {
  const { setOpen: openAddSceneEditor } = useAddSceneEditorStore();
  const { testStory } = useTestStory();

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      const isAnyInputFocused = document.activeElement !== document.body;

      if (isAnyInputFocused) return;

      const key = e.key.toLocaleLowerCase();

      switch (key) {
        case "n":
          openAddSceneEditor(true);
          e.preventDefault();
          break;
        case "t":
          testStory(firstSceneKey);
          e.preventDefault();
      }
    },
    [firstSceneKey, openAddSceneEditor, testStory],
  );

  useEffect(() => {
    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [handleKeyPress]);
};
