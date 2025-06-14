import { useCallback, useEffect } from "react";
import { useAddSceneEditorStore } from "./use-add-scene-editor-store";
import { useTestStory } from "./use-test-story";
import { useExportModalStore } from "../components/export-modal";

const isAnyInputFocused = () =>
  ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName ?? "");

// ShadCN sets pointer-events: 'none' on the body when a dialog is open
const isAnyModalOpen = () => document.body.style.pointerEvents === "none";

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
      if (isAnyInputFocused()) return;

      const key = e.key.toLocaleLowerCase();

      switch (key) {
        case "n":
          if (isAnyModalOpen()) return;
          openAddSceneEditor(true);
          e.preventDefault();
          break;
        case "t":
          testStory(firstSceneKey);
          e.preventDefault();
          break;
        case "e":
          if (isAnyModalOpen()) return;
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
