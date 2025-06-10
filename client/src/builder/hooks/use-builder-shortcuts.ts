import { useCallback, useEffect } from "react";
import { useAddSceneEditorStore } from "./use-add-scene-editor-store";

export const useBuilderShortCuts = () => {
  const { setOpen: openAddSceneEditor } = useAddSceneEditorStore();

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      const isAnyInputFocused = document.activeElement !== document.body;

      if (isAnyInputFocused) return;

      if (e.key.toLocaleLowerCase() === "n") {
        openAddSceneEditor(true);
        e.preventDefault();
      }
    },
    [openAddSceneEditor],
  );

  useEffect(() => {
    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [handleKeyPress]);
};
