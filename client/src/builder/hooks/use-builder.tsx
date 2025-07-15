import { MouseEvent, useEffect } from "react";
import { useNodesState, useEdgesState, useReactFlow } from "@xyflow/react";
import { useBuilderEdges } from "./use-builder-edges";
import { BuilderNode } from "../types";
import { useBuilderShortCuts } from "./use-builder-shortcuts";
import { useBuilderContext } from "./use-builder-context";
import { getBuilderService } from "@/get-builder-service";
import { SceneUpdatePayload } from "../components/scene-editor/schema";

// For now state is entirely dictated by the local dexie-db, but this could be a performance
// issue in very large stories

export const useBuilder = () => {
  const {
    edges: edgesFromContext,
    nodes: nodesFromContext,
    story,
  } = useBuilderContext();
  const [nodes, setNodes, onNodesChange] = useNodesState(nodesFromContext);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edgesFromContext);
  const rf = useReactFlow<BuilderNode>();

  const builderService = getBuilderService();
  const edgesProps = useBuilderEdges({
    setEdges,
    sceneNodes: nodesFromContext,
  });

  useBuilderShortCuts({ firstSceneKey: story.firstSceneKey });

  useEffect(() => {
    setNodes(nodesFromContext);
    setEdges(edgesFromContext);
  }, [setNodes, edgesFromContext, nodesFromContext, setEdges]);

  const onNodeMove = (_: MouseEvent, node: BuilderNode) => {
    builderService.updateSceneBuilderPosition(node.data.key, node.position);
    // TODO: handle service errors
  };

  const onNodesDelete = (nodes: BuilderNode[]) => {
    builderService.deleteScenes(nodes.map(({ data: { key } }) => key));
  };

  const updateSceneContent = async (scene: SceneUpdatePayload) => {
    builderService.updateScene(scene);
    const nodes = rf.getNodes();
    setNodes(
      nodes.map((n) =>
        n.data.key === scene.key
          ? {
              ...n,
              data: {
                ...n.data,
                title: scene.title,
                content: scene.content,
                actions: scene.actions,
              },
            }
          : n,
      ),
    );
    // handle service errors
  };

  return {
    onNodeMove,
    nodes: nodes.map((node) => ({ ...node, selectable: true })),
    edges,
    onNodesChange,
    onEdgesChange,
    onNodesDelete,
    updateScene: updateSceneContent,
    ...edgesProps,
  };
};
