import { useMemo, useEffect, useCallback, MouseEvent } from "react";
import { useNodesState, useEdgesState } from "@xyflow/react";
import { scenesToNodesAndEdgesAdapter } from "../adapters";
import { useBuilderEdges } from "./use-builder-edges";
import { Scene, Story } from "@/lib/storage/domain";
import { BuilderNode } from "../types";
import { getBuilderService } from "@/services";

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
  const builderService = useMemo(() => getBuilderService(), []);

  const edgesProps = useBuilderEdges({ setEdges, sceneNodes });

  useEffect(() => {
    setNodes(sceneNodes);
  }, [sceneNodes, setNodes]);

  const onNodeMove = useCallback(
    (_: MouseEvent, node: BuilderNode) => {
      builderService.updateSceneBuilderPosition(node.data.key, node.position);
    },
    [builderService],
  );

  const onNodesDelete = useCallback(
    (nodes: BuilderNode[]) => {
      builderService.deleteScenes(nodes.map(({ data: { key } }) => key));
    },
    [builderService],
  );
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
