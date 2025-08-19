import { Dispatch, SetStateAction, useCallback } from "react";
import {
  Connection,
  Edge,
  FinalConnectionState,
  addEdge,
  reconnectEdge,
  useReactFlow,
} from "@xyflow/react";
import { nodeToSceneAdapter } from "../adapters";
import { getBuilderService } from "@/get-builder-service";
import { DEFAULT_SCENE, useAddScene } from "./use-add-scene";
import { Story } from "@/lib/storage/domain";
import { BuilderNode } from "../types";

export const useBuilderEdges = ({
  setEdges,
}: {
  story: Story;
  setEdges: Dispatch<SetStateAction<Edge[]>>;
}) => {
  const { getNodes } = useReactFlow<BuilderNode>();

  const getSceneToUpdate = useCallback(
    (edge: Edge | Connection) => {
      const sourceScene = getNodes().find((scene) => scene.id === edge.source);

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
    [getNodes],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const sceneData = getSceneToUpdate(connection);
      if (!sceneData) {
        console.error("Connection error: scene data is null");
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
  const { screenToFlowPosition } = useReactFlow();
  const onConnectEnd = useCallback(
    async (
      ev: MouseEvent | TouchEvent,
      connectionState: FinalConnectionState,
    ) => {
      // create a node on edge drop
      if (!connectionState.isValid && connectionState.fromNode) {
        const event = "changedTouches" in ev ? ev.changedTouches[0] : ev;
        if (!event) return;
        // truthy when the handle is a source handle
        const fromHandle = connectionState.fromHandle?.id ?? null;
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });
        // TODO: unify constants regarding the scene component in a single place
        // Magic values to hover right over the correct handle:
        const offset = fromHandle ? { x: 0, y: 0 } : { x: 375 - 16, y: 27.5 };
        const scene = await addScene(
          { x: position.x - offset.x, y: position.y - offset.y },
          fromHandle
            ? DEFAULT_SCENE
            : {
                ...DEFAULT_SCENE,
                actions: [
                  {
                    text: "...",
                  },
                ],
              },
        );
        const fromNode = connectionState.fromNode.id;
        const toNode = scene.key;
        const toHandle = `${toNode}-0`;
        setTimeout(() => {
          onConnect({
            source: fromHandle ? fromNode : toNode,
            target: fromHandle ? toNode : fromNode,
            sourceHandle: fromHandle ?? toHandle,
            targetHandle: null,
          });
        }, 0);
      }
    },
    [addScene, onConnect, screenToFlowPosition],
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
