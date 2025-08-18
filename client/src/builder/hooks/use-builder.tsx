import { Dispatch, MouseEvent, SetStateAction, useEffect } from "react";
import {
  useNodesState,
  useEdgesState,
  OnNodeDrag,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnNodesDelete,
  OnConnect,
  OnConnectEnd,
  OnEdgesDelete,
} from "@xyflow/react";
import { useBuilderEdges } from "./use-builder-edges";
import { BuilderNode, SceneNodeType } from "../types";
import { useBuilderShortCuts } from "./use-builder-shortcuts";
import { useBuilderContext } from "./use-builder-context";
import { getBuilderService } from "@/get-builder-service";

// For now state is entirely dictated by the local dexie-db, but this could be a performance
// issue in very large stories

export function useBuilder(): BuilderMeta {
  const {
    edges: edgesFromContext,
    nodes: nodesFromContext,
    story,
  } = useBuilderContext();
  const [nodes, setNodes, onNodesChange] = useNodesState(nodesFromContext);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edgesFromContext);

  const builderService = getBuilderService();
  const { onConnect, onConnectEnd, onEdgesDelete } = useBuilderEdges({
    sceneNodes: nodesFromContext,
    story,
    setEdges,
    setNodes,
  });

  useBuilderShortCuts({ firstSceneKey: story.firstSceneKey, setNodes });

  useEffect(() => {
    setNodes(nodesFromContext);
    setEdges(edgesFromContext);
  }, [setNodes, edgesFromContext, nodesFromContext, setEdges]);

  const onNodeDragStop = (_: MouseEvent, node: BuilderNode) => {
    builderService.updateSceneBuilderPosition(node.data.key, node.position);
    // TODO: handle service errors
  };

  const onNodesDelete = (nodes: BuilderNode[]) => {
    builderService.deleteScenes(nodes.map(({ data: { key } }) => key));
  };

  return {
    setNodes,
    attributes: {
      nodes: nodes.map((node) => ({ ...node, selectable: true })),
      edges,
      onNodeDragStop,
      onNodesChange,
      onEdgesChange,
      onNodesDelete,
      onConnect,
      onConnectEnd,
      onEdgesDelete,
    },
  };
}

export type BuilderMeta = {
  setNodes: Dispatch<SetStateAction<SceneNodeType[]>>;
  attributes: {
    nodes: SceneNodeType[];
    edges: Edge[];
    onNodeDragStop: OnNodeDrag<BuilderNode>;
    onNodesChange: OnNodesChange<BuilderNode>;
    onEdgesChange: OnEdgesChange<Edge>;
    onNodesDelete: OnNodesDelete<BuilderNode>;
    onConnect: OnConnect;
    onConnectEnd: OnConnectEnd;
    onEdgesDelete: OnEdgesDelete<Edge>;
  };
};
