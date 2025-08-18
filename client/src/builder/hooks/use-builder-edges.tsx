import { Dispatch, SetStateAction, useCallback } from "react";
import {
  Connection,
  Edge,
  FinalConnectionState,
  Node,
  addEdge,
  reconnectEdge,
} from "@xyflow/react";
import { SceneProps } from "../types";
import { nodeToSceneAdapter, sceneToNodeAdapter } from "../adapters";
import { getBuilderService } from "@/get-builder-service";
import { useAddScene } from "./use-add-scene";
import { Story } from "@/lib/storage/domain";

export const useBuilderEdges = ({
  sceneNodes,
  story,
  setEdges,
}: {
  sceneNodes: Node<SceneProps, "scene">[];
  story: Story;
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
    (connection: Connection) => {
      const sceneData = getSceneToUpdate(connection);
      if (!sceneData) {
        // TODO: Add toast
        return;
      }

      getBuilderService().addSceneConnection({
        sourceScene: sceneData.sceneToUpdate,
        destinationSceneKey: connection.target!,
        actionIndex: sceneData.actionIndex,
      });

      // Replace the existing edge if existed, otherwise simply add a new edge
      setEdges((prev) => {
        const existingEdgeAtHandle = prev.find(
          (ed) => ed.sourceHandle === connection.sourceHandle,
        );
        if (existingEdgeAtHandle)
          return reconnectEdge(existingEdgeAtHandle, connection, prev, {
            shouldReplaceId: false,
          });
        else return addEdge(connection, prev);
      });
    },
    [getSceneToUpdate, setEdges],
  );

  const { addScene } = useAddScene();
  const onConnectEnd = useCallback(
    async (
      ev: MouseEvent | TouchEvent,
      connectionState: FinalConnectionState,
    ) => {
      // create a node on edge drop
      if (
        !connectionState.isValid &&
        connectionState.fromNode &&
        connectionState.fromHandle?.id
      ) {
        const event = "changedTouches" in ev ? ev.changedTouches[0] : ev;
        if (!event) return;
        const scene = await addScene({ x: event.clientX, y: event.clientY });
        const node = sceneToNodeAdapter({ scene, story });
        onConnect({
          source: connectionState.fromNode.id,
          sourceHandle: connectionState.fromHandle.id,
          target: node.id,
          targetHandle: null,
        });
      }
    },
    [addScene, onConnect, story],
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

  return { onConnect, onConnectEnd, onEdgesDelete };
};
