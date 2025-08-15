import { Dispatch, SetStateAction, useCallback } from "react";
import { Connection, Edge, Node, addEdge } from "@xyflow/react";
import { SceneProps } from "../types";
import { nodeToSceneAdapter } from "../adapters";
import { getBuilderService } from "@/get-builder-service";

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

      const actionIndex = parseInt(
        edge.sourceHandle?.split("-").at(-1) ?? "-1",
      );

      if (
        !sourceScene ||
        edge.target === null ||
        actionIndex === -1 ||
        Number.isNaN(actionIndex)
      ) {
        return null;
      }

      const sceneToUpdate = nodeToSceneAdapter(sourceScene);

      return { sceneToUpdate, actionIndex };
    },
    [sceneNodes],
  );

  const onConnect = useCallback(
    (edge: Edge | Connection) => {
      const sceneData = getSceneToUpdate(edge);
      if (!sceneData) {
        // TODO: Add toast
        return;
      }

      getBuilderService().addSceneConnection({
        sourceScene: sceneData.sceneToUpdate,
        destinationSceneKey: edge.target!,
        actionIndex: sceneData.actionIndex,
      });

      // Replace the existing edge if existed, otherwise simply add a new edge
      setEdges((prev) => {
        const edges = prev.filter(
          (ed) => ed.sourceHandle !== edge.sourceHandle,
        );
        return addEdge(edge, edges);
      });
    },
    [getSceneToUpdate, setEdges],
  );

  const onEdgesDelete = useCallback(
    (edges: Edge[]) => {
      edges.forEach((edge) => {
        const sceneData = getSceneToUpdate(edge);
        if (!sceneData) {
          // TODO: Add toast
          return;
        }

        getBuilderService().removeSceneConnection({
          sourceScene: sceneData.sceneToUpdate,
          actionIndex: sceneData.actionIndex,
        });
      });
    },
    [getSceneToUpdate],
  );

  return { onConnect, onEdgesDelete };
};
