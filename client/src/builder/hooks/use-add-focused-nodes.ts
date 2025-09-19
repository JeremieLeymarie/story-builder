import { useReactFlow, useStoreApi } from "@xyflow/react";
import { BuilderNode } from "../types";
import { useBuilderEditorStore } from "./use-scene-editor-store";
import { nodeToSceneAdapter } from "../adapters";

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
        payload: { scene: nodeToSceneAdapter(nodes[0]!), isFirstScene: false },
      });
    }
  };

  return addFocusedNodes;
};
