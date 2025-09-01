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
import { DEFAULT_SCENE, useAddScenes } from "./use-add-scenes";
import { BuilderNode } from "../types";
import { useBuilderError } from "./use-builder-error";
import { sceneConsts } from "../components/nodes/scene/scene-constants";

export const useBuilderEdges = () => {
  const { getNodes, setEdges } = useReactFlow<BuilderNode>();
  const { handleError } = useBuilderError();
  const { addScenes } = useAddScenes();
  const { screenToFlowPosition } = useReactFlow();

  const getSceneToUpdate = (edge: Edge | Connection) => {
    const sourceScene = getNodes().find((scene) => scene.id === edge.source);

    const actionIndex = parseInt(edge.sourceHandle?.split("-").at(-1) ?? "NaN");

    if (!sourceScene || Number.isNaN(actionIndex)) {
      return null;
    }

    const sceneToUpdate = nodeToSceneAdapter(sourceScene);

    return { sceneToUpdate, actionIndex };
  };

  const onConnect = (connection: Connection) => {
    const sceneData = getSceneToUpdate(connection);
    if (!sceneData) {
      console.error("Connection error: scene data is null");
      return;
    }

    getBuilderService()
      .addSceneConnection({
        sourceSceneKey: sceneData.sceneToUpdate.key,
        destinationSceneKey: connection.target,
        actionIndex: sceneData.actionIndex,
      })
      .catch(handleError);

    // Optimistic update: replace the existing edge if existed, otherwise simply add a new edge
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
  };

  const onConnectEnd = (
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
      // Places the node over the correct handle:
      const offset = fromHandle
        ? { x: 0, y: 0 }
        : {
            x: sceneConsts.width - sceneConsts.itemPadding,
            y: sceneConsts.text2xl / 2 + sceneConsts.itemPadding,
          };
      const scene = addScenes(
        [
          fromHandle
            ? DEFAULT_SCENE
            : { ...DEFAULT_SCENE, actions: [{ text: "" }] },
        ],
        { x: position.x - offset.x, y: position.y - offset.y },
      );
      if (!scene) return;

      const fromNode = connectionState.fromNode.id;
      const toNode = scene[0]!.key;

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
  };

  const onEdgesDelete = (edges: Edge[]) => {
    edges.forEach((edge) => {
      const sceneData = getSceneToUpdate(edge);
      if (!sceneData) {
        console.error("Connection error: scene data is null");
        return;
      }

      getBuilderService()
        .removeSceneConnection({
          sourceScene: sceneData.sceneToUpdate,
          actionIndex: sceneData.actionIndex,
        })
        .catch(handleError);
    });
  };

  return { onConnect, onConnectEnd, onEdgesDelete };
};
