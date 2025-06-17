import { useMemo, useEffect, MouseEvent } from "react";
import { useNodesState, useEdgesState, useReactFlow } from "@xyflow/react";
import { scenesToNodesAndEdgesAdapter } from "../adapters";
import { useBuilderEdges } from "./use-builder-edges";
import { Scene, Story } from "@/lib/storage/domain";
import { BuilderNode } from "../types";
import { getBuilderService } from "@/services";
import { useBuilderShortCuts } from "./use-builder-shortcuts";

// For now state is entirely dictated by the local dexie-db, but this could be a performance
// issue in very large stories

export const useBuilder = ({
  scenes,
  story,
}: {
  scenes: Scene[];
  story: Story;
}) => {
  const [sceneNodes, sceneEdges] = useMemo(
    () => scenesToNodesAndEdgesAdapter({ scenes, story }),
    [scenes, story],
  );
  const [nodes, setNodes, onNodesChange] = useNodesState(sceneNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(sceneEdges);
  const { fitView } = useReactFlow();

  const builderService = getBuilderService();
  const edgesProps = useBuilderEdges({ setEdges, sceneNodes });

  useBuilderShortCuts({ firstSceneKey: story.firstSceneKey });

  useEffect(() => {
    setNodes(sceneNodes);
    setEdges(sceneEdges);
    fitView();
  }, [fitView, sceneEdges, sceneNodes, setEdges, setNodes]);

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
