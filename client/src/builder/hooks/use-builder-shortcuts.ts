import { useCallback, useEffect } from "react";
import { useAddSceneEditorStore } from "./use-add-scene-editor-store";
import { useTestStory } from "./use-test-story";
import { useExportModalStore } from "../components/export-modal";

export const useBuilderShortCuts = ({
  firstSceneKey,
}: {
  firstSceneKey: string;
}) => {
  const { setOpen: openAddSceneEditor } = useAddSceneEditorStore();
  const { setOpen: openExportModal } = useExportModalStore();
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
          break;
        case "e":
          openExportModal(true);
          e.preventDefault();
          break;
      }
    },
    [firstSceneKey, openAddSceneEditor, openExportModal, testStory],
  );

  useEffect(() => {
    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [handleKeyPress]);
};
