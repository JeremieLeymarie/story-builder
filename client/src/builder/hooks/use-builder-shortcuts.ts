import { useEffect } from "react";
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

  // Exhaustive-deps rules doesn't work well with the compiler, see: https://github.com/reactwg/react-compiler/discussions/18
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleKeyPress = (e: KeyboardEvent) => {
    if (isAnyInputFocused()) return;

    const key = e.key.toLocaleLowerCase();

    switch (key) {
      case "n":
        if (isAnyModalOpen()) return;
        addScene();
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
  };

  useEffect(() => {
    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [handleKeyPress]);
};
