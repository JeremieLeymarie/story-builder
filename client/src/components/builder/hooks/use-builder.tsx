import { Scene } from "@/lib/storage/dexie-db";
import { getRepository } from "@/lib/storage/indexed-db-repository";
import { useMemo, useEffect, useCallback, MouseEvent } from "react";
import {
  useNodesState,
  useEdgesState,
  Edge,
  Node,
  Connection,
  addEdge,
} from "reactflow";
import { scenesToNodesAndEdgesAdapter, nodeToSceneAdapter } from "../adapters";

export const useBuilder = ({ scenes }: { scenes: Scene[] }) => {
  const [sceneNodes, sceneEdges] = useMemo(
    () => scenesToNodesAndEdgesAdapter(scenes),
    [scenes]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(sceneNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(sceneEdges);

  useEffect(() => {
    setNodes(sceneNodes);
  }, [sceneNodes, setNodes]);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      console.log(params);
      const sourceScene = sceneNodes.find(
        (scene) => scene.id === params.source
      );

      if (!sourceScene || params.target === null) {
        // TODO: add toast
        return;
      }

      const actionIndex = parseInt(params.sourceHandle?.split("-")[1] ?? "-1");

      if (actionIndex === -1) {
        // TODO: add toast
        return;
      }

      const sceneToUpdate = nodeToSceneAdapter(sourceScene);

      const actions = sceneToUpdate.actions.map((action, i) => {
        if (i === actionIndex) {
          return { ...action, sceneId: parseInt(params.target!) };
        }
        return action;
      });

      getRepository()
        .updateScene({ ...sceneToUpdate, actions })
        .then((res) => {
          console.log(res);
        });

      setEdges((eds) => addEdge(params, eds));
    },
    [sceneNodes, setEdges]
  );

  // TODO: use better typing
  const onNodeMove = useCallback((_: MouseEvent, node: Node) => {
    getRepository().updateScene({
      ...node.data,
      builderParams: { position: node.position },
    });
  }, []);

  return { onNodeMove, onConnect, nodes, edges, onNodesChange, onEdgesChange };
};
