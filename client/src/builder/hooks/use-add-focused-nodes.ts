import { useReactFlow, useStoreApi } from "@xyflow/react";
import { BuilderNode } from "../types";
import { useBuilderEditorStore } from "./use-builder-editor-store";

export const useAddFocusedNodes = () => {
  const { getState, setState } = useStoreApi();
  const { resetSelectedElements } = getState();
  const { addNodes } = useReactFlow();
  const openSceneEditor = useBuilderEditorStore((state) => state.open);

  const addFocusedNodes = (nodes: BuilderNode[]) => {
    resetSelectedElements();
    addNodes(nodes.map((node) => ({ ...node, selected: true })));
    setState({ nodesSelectionActive: false });

    if (nodes.length === 1) {
      openSceneEditor({
        type: "scene-editor",
        payload: { sceneKey: nodes[0]!.data.key, isFirstScene: false },
      });
    }
  };

  return addFocusedNodes;
};
