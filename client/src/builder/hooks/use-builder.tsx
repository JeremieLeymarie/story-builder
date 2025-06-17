import { MouseEvent } from "react";
import { useNodesState, useEdgesState } from "@xyflow/react";
import { useBuilderEdges } from "./use-builder-edges";
import { BuilderNode } from "../types";
import { getBuilderService } from "@/services";
import { useBuilderShortCuts } from "./use-builder-shortcuts";
import { useBuilderContext } from "./use-builder-store";

// For now state is entirely dictated by the local dexie-db, but this could be a performance
// issue in very large stories

export const useBuilder = () => {
  const { edges: edges_, nodes: nodes_, story } = useBuilderContext();
  const [nodes, _, onNodesChange] = useNodesState(nodes_);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edges_);

  const builderService = getBuilderService();
  const edgesProps = useBuilderEdges({ setEdges, sceneNodes: nodes_ });

  useBuilderShortCuts({ firstSceneKey: story.firstSceneKey });

  const onNodeMove = (_: MouseEvent, node: BuilderNode) => {
    builderService.updateSceneBuilderPosition(node.data.key, node.position);
  };

  const onNodesDelete = (nodes: BuilderNode[]) => {
    builderService.deleteScenes(nodes.map(({ data: { key } }) => key));
  };

  return {
    onNodeMove,
    nodes: nodes.map((node) => ({ ...node, selectable: true })),
    edges,
    onNodesChange,
    onEdgesChange,
    onNodesDelete,
    ...edgesProps,
  };
};
