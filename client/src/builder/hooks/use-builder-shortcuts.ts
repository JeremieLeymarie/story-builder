import { useTestStory } from "./use-test-story";
import { useExportModalStore } from "./use-export-modal-store";
import { useReactFlow, useStoreApi } from "@xyflow/react";
import { BuilderNode } from "../types";
import { DEFAULT_SCENE, useAddScenes } from "./use-add-scenes";
import { getUserOS } from "@/lib/get-os";
import { useCopyPaste } from "./use-copy-paste";
import { useEffect } from "react";
import { useBuilderEditorStore } from "./use-scene-editor-store";

export const isAnyInputFocused = () => {
  const isInputFocused = document.activeElement?.tagName === "INPUT";
  const isTextAreaFocused = document.activeElement?.tagName === "TEXTAREA";
  const isContentEditableFocused =
    document.activeElement?.getAttribute("contenteditable") === "true";
  // ShadCN sets pointer-events: 'none' on the body when a dialog is open
  const isAnyModalOpen = document.body.style.pointerEvents === "none";

  return (
    isInputFocused ||
    isTextAreaFocused ||
    isContentEditableFocused ||
    isAnyModalOpen
  );
};

export const useBuilderShortCuts = ({
  firstSceneKey,
}: {
  firstSceneKey: string;
}) => {
  const { addScenes } = useAddScenes();
  const openExportModal = useExportModalStore((state) => state.setOpen);
  const { testStory } = useTestStory();
  const { getNodes } = useReactFlow<BuilderNode>();
  const { addSelectedNodes, resetSelectedElements } = useStoreApi().getState();
  const { onCopyOrCut, onPaste } = useCopyPaste();
  const closeEditor = useBuilderEditorStore((state) => state.close);

  const shortcuts: Record<string, (e: KeyboardEvent) => void> = {
    ["n"]() {
      addScenes([DEFAULT_SCENE], "auto");
    },
    ["t"]() {
      testStory(firstSceneKey);
    },
    ["e"]() {
      openExportModal(true);
    },
    ["ctrl+a"]() {
      addSelectedNodes(getNodes().map((node) => node.id));
    },
    ["escape"]() {
      resetSelectedElements();
      closeEditor();
    },
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.isComposing || isAnyInputFocused()) return;
    const key = e.key.toLocaleLowerCase();
    for (const binding of Object.keys(shortcuts)) {
      if (!binding.endsWith(key)) continue;
      e.preventDefault();
      if (e.repeat) return;
      if (
        binding.match("ctrl") &&
        (getUserOS() === "Mac" ? !e.metaKey : !e.ctrlKey)
      )
        continue;
      if (binding.match("shift") && !e.shiftKey) continue;
      if (binding.match("alt") && !e.altKey) continue;
      shortcuts[binding]!(e);
    }
  };

  useEffect(() => {
    document.body.addEventListener("keydown", handleKeyDown);
    document.body.addEventListener("copy", onCopyOrCut);
    document.body.addEventListener("cut", onCopyOrCut);
    document.body.addEventListener("paste", onPaste);
    return () => {
      document.body.removeEventListener("keydown", handleKeyDown);
      document.body.removeEventListener("copy", onCopyOrCut);
      document.body.removeEventListener("cut", onCopyOrCut);
      document.body.removeEventListener("paste", onPaste);
    };
  });
};
