import { Scene } from "@/lib/storage/dexie-db";
import { getRepository } from "@/lib/storage/indexed-db-repository";
import { useMemo, useEffect, useCallback, MouseEvent } from "react";
import { useNodesState, useEdgesState, Node } from "reactflow";
import { scenesToNodesAndEdgesAdapter } from "../adapters";
import { useBuilderEdges } from "./use-builder-edges";

export const useBuilder = ({ scenes }: { scenes: Scene[] }) => {
  const [sceneNodes, sceneEdges] = useMemo(
    () => scenesToNodesAndEdgesAdapter(scenes),
    [scenes]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(sceneNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(sceneEdges);

  const edgesProps = useBuilderEdges({ setEdges, sceneNodes });

  useEffect(() => {
    setNodes(sceneNodes);
  }, [sceneNodes, setNodes]);

  // TODO: use better typing
  const onNodeMove = useCallback((_: MouseEvent, node: Node) => {
    getRepository().updateScene({
      ...node.data,
      builderParams: { position: node.position },
    });
  }, []);

  return {
    onNodeMove,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    ...edgesProps,
  };
};
