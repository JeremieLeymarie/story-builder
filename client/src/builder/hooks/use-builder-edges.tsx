import { Dispatch, SetStateAction, useCallback } from "react";
import { Connection, Edge, Node, addEdge } from "reactflow";
import { SceneProps } from "../types";
import { nodeToSceneAdapter } from "../adapters";
import { getLocalRepository } from "@/lib/storage/dexie/indexed-db-repository";

export const useBuilderEdges = ({
  sceneNodes,
  setEdges,
}: {
  sceneNodes: Node<SceneProps, "scene">[];
  setEdges: Dispatch<SetStateAction<Edge[]>>;
}) => {
  const getSceneToUpdate = useCallback(
    (edge: Edge | Connection) => {
      const sourceScene = sceneNodes.find((scene) => scene.id === edge.source);
      const actionIndex = parseInt(edge.sourceHandle?.split("-")[1] ?? "-1");

      if (!sourceScene || edge.target === null || actionIndex === -1) {
        return null;
      }

      const sceneToUpdate = nodeToSceneAdapter(sourceScene);

      return { sceneToUpdate, actionIndex };
    },
    [sceneNodes]
  );

  const onConnect = useCallback(
    (edge: Edge | Connection) => {
      const sceneData = getSceneToUpdate(edge);
      if (!sceneData) {
        // TODO: Add toast
        return;
      }

      const actions = sceneData.sceneToUpdate.actions.map((action, i) => {
        if (i === sceneData.actionIndex) {
          return { ...action, sceneKey: edge.target! };
        }
        return action;
      });

      getLocalRepository().updateScene({ ...sceneData.sceneToUpdate, actions });

      setEdges((eds) => addEdge(edge, eds));
    },
    [getSceneToUpdate, setEdges]
  );

  const onEdgesDelete = useCallback(
    (edges: Edge[]) => {
      edges.forEach((edge) => {
        const sceneData = getSceneToUpdate(edge);
        if (!sceneData) {
          // TODO: Add toast
          return;
        }

        const actions = sceneData.sceneToUpdate.actions.map((action, i) => {
          if (i === sceneData.actionIndex) {
            return { ...action, sceneKey: undefined };
          }
          return action;
        });

        getLocalRepository().updateScene({
          ...sceneData.sceneToUpdate,
          actions,
        });
      });
    },
    [getSceneToUpdate]
  );

  return { onConnect, onEdgesDelete };
};
