import { MouseEvent } from "react";
import { useNodesState, useEdgesState } from "@xyflow/react";
import { useBuilderEdges } from "./use-builder-edges";
import { BuilderNode } from "../types";
import { useBuilderShortCuts } from "./use-builder-shortcuts";
import { useBuilderContext } from "./use-builder-context";
import { getBuilderService } from "@/get-builder-service";
import { useBuilderError } from "./use-builder-error";

export const useBuilder = () => {
  const {
    edges: edgesFromContext,
    nodes: nodesFromContext,
    story,
  } = useBuilderContext();
  const [nodes, _setNodes, onNodesChange] = useNodesState(nodesFromContext);
  const [edges, _setEdges, onEdgesChange] = useEdgesState(edgesFromContext);

  const { handleError } = useBuilderError();
  const builderService = getBuilderService();
  const { onConnect, onConnectEnd, onEdgesDelete } = useBuilderEdges();

  useBuilderShortCuts({ firstSceneKey: story.firstSceneKey });

  const onNodeDragStop = (_: MouseEvent, node: BuilderNode) => {
    builderService
      .updateSceneBuilderPosition(node.data.key, node.position)
      .catch(handleError);
  };

  const onNodesDelete = (nodes: BuilderNode[]) => {
    builderService
      .deleteScenes(nodes.map(({ data: { key } }) => key))
      .catch(handleError);
  };

  return {
    nodes,
    edges,
    onNodeDragStop,
    onNodesChange,
    onEdgesChange,
    onNodesDelete,
    onConnect,
    onConnectEnd,
    onEdgesDelete,
  };
};
