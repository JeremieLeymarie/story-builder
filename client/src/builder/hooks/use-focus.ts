import { useReactFlow, useStoreApi } from "@xyflow/react";
import { BuilderNode } from "../types";
import { useBuilderEditorStore } from "./use-scene-editor-store";
import { nodeToSceneAdapter } from "../adapters";

export const useAddFocussedNodes = () => {
  const { getState, setState } = useStoreApi();
  const { resetSelectedElements } = getState();
  const { addNodes } = useReactFlow();
  const openSceneEditor = useBuilderEditorStore((state) => state.open);

  const addFocussedNodes = (nodes: BuilderNode[]) => {
    resetSelectedElements();
    nodes.forEach((node) => (node.selected = true));
    addNodes(nodes);
    setState({ nodesSelectionActive: false });

    if (nodes.length === 1) {
      openSceneEditor({
        type: "scene-editor",
        payload: { scene: nodeToSceneAdapter(nodes[0]!), isFirstScene: false },
      });
    }
  };

  return addFocussedNodes;
};
