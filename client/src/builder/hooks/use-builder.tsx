import { MouseEvent, useEffect } from "react";
import { useNodesState, useEdgesState, useReactFlow } from "@xyflow/react";
import { useBuilderEdges } from "./use-builder-edges";
import { BuilderNode } from "../types";
import { getBuilderService } from "@/services";
import { useBuilderShortCuts } from "./use-builder-shortcuts";
import { useBuilderContext } from "./use-builder-store";
import { FIT_VIEW_DURATION } from "../constants";

// For now state is entirely dictated by the local dexie-db, but this could be a performance
// issue in very large stories

export const useBuilder = () => {
  const { edges: edges_, nodes: nodes_, story } = useBuilderContext();
  const [nodes, setNodes, onNodesChange] = useNodesState(nodes_);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edges_);
  const { fitView } = useReactFlow();

  const builderService = getBuilderService();
  const edgesProps = useBuilderEdges({ setEdges, sceneNodes: nodes_ });

  useBuilderShortCuts({ firstSceneKey: story.firstSceneKey });

  useEffect(() => {
    setNodes(nodes_);
    setEdges(edges_);
    fitView({ duration: FIT_VIEW_DURATION });
  }, [setNodes, edges_, nodes_, setEdges, fitView]);

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
