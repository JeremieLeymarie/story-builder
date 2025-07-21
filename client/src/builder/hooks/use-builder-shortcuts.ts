import { useCallback, useEffect } from "react";
import { useTestStory } from "./use-test-story";
import { useExportModalStore } from "./use-export-modal-store";
import { useAddScene } from "./use-add-scene";

const isAnyInputFocused = () => {
  const isInputFocused = document.activeElement?.tagName === "INPUT";
  const isTextAreaFocused = document.activeElement?.tagName === "TEXTAREA";
  const isContentEditableFocused =
    document.activeElement?.getAttribute("contenteditable") === "true";

  return isInputFocused || isTextAreaFocused || isContentEditableFocused;
};

// ShadCN sets pointer-events: 'none' on the body when a dialog is open
const isAnyModalOpen = () => document.body.style.pointerEvents === "none";

export const useBuilderShortCuts = ({
  firstSceneKey,
}: {
  firstSceneKey: string;
}) => {
  const { addScene } = useAddScene();
  const { setOpen: openExportModal } = useExportModalStore();
  const { testStory } = useTestStory();

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (isAnyInputFocused()) return;

      const key = e.key.toLocaleLowerCase();

      switch (key) {
        case "n":
          if (isAnyModalOpen()) return;
          addScene({ actions: [], content: {}, title: "" });
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
    [addScene, firstSceneKey, openExportModal, testStory],
  );

  useEffect(() => {
    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [handleKeyPress]);
};
