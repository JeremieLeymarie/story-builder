import { Dispatch, SetStateAction, useCallback } from "react";
import {
  Connection,
  Edge,
  FinalConnectionState,
  Node,
  addEdge,
  reconnectEdge,
} from "@xyflow/react";
import { SceneNodeType, SceneProps } from "../types";
import { nodeToSceneAdapter } from "../adapters";
import { getBuilderService } from "@/get-builder-service";
import { useAddScene } from "./use-add-scene";
import { Story } from "@/lib/storage/domain";

export const useBuilderEdges = ({
  sceneNodes,
  setEdges,
  setNodes,
}: {
  sceneNodes: Node<SceneProps, "scene">[];
  story: Story;
  setEdges: Dispatch<SetStateAction<Edge[]>>;
  setNodes: Dispatch<SetStateAction<SceneNodeType[]>>;
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

  const { addScene } = useAddScene(setNodes);
  const onConnectEnd = useCallback(
    async (
      ev: MouseEvent | TouchEvent,
      connectionState: FinalConnectionState,
    ) => {
      if (!connectionState.isValid) {
        const event = "changedTouches" in ev ? ev.changedTouches[0] : ev;
        const node = await addScene(
          event ? { x: event.clientX, y: event.clientY } : undefined,
        );
        // Something has gone very wrong if any of those aren't defined, in which case there are probably *bigger* things to worry about.
        onConnect({
          source: connectionState.fromNode?.id ?? "",
          target: node.id,
          sourceHandle: connectionState.fromHandle?.id ?? "",
          targetHandle: node.handles?.[0]?.id ?? "",
        });
      }
    },
    [addScene, onConnect],
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
