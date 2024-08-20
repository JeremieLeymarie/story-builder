import { useMemo, useEffect, useCallback, MouseEvent } from "react";
import {
  useNodesState,
  useEdgesState,
  useOnSelectionChange,
} from "@xyflow/react";
import { scenesToNodesAndEdgesAdapter } from "../adapters";
import { useBuilderEdges } from "./use-builder-edges";
import { Scene, Story } from "@/lib/storage/domain";
import { BuilderNode } from "../types";
import { getBuilderService } from "@/services";

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

  useOnSelectionChange({
    onChange: (params) => {
      console.log(params);
    },
  });

  const edgesProps = useBuilderEdges({ setEdges, sceneNodes });

  useEffect(() => {
    setNodes(sceneNodes);
  }, [sceneNodes, setNodes]);

  // TODO: use better typing
  const onNodeMove = useCallback((_: MouseEvent, node: BuilderNode) => {
    getBuilderService().updateSceneBuilderPosition(
      node.data.key,
      node.position,
    );
  }, []);

  return {
    onNodeMove,
    nodes: nodes.map((node) => ({ ...node, selectable: true })),
    edges,
    onNodesChange,
    onEdgesChange,
    ...edgesProps,
  };
};
