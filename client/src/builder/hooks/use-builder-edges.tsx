import {
  Connection,
  Edge,
  FinalConnectionState,
  addEdge,
  useReactFlow,
} from "@xyflow/react";
import { nodeToSceneAdapter } from "../adapters";
import { BuilderNode } from "../types";
import { useBuilderError } from "./use-builder-error";
import { DEFAULT_SCENE, useAddScene } from "./use-add-scene";
import { useBuilderContext } from "./use-builder-context";

export const useBuilderEdges = () => {
  const { getNodes, setEdges } = useReactFlow<BuilderNode>();
  const { handleError } = useBuilderError();
  const { addScene } = useAddScene();
  const { screenToFlowPosition } = useReactFlow();
  const { builderService } = useBuilderContext();

  const getSceneToUpdate = (edge: Edge | Connection) => {
    const sourceScene = getNodes().find((scene) => scene.id === edge.source);
    const actionKey = edge.sourceHandle;

    if (!sourceScene || !actionKey) {
      return null;
    }

    const sceneToUpdate = nodeToSceneAdapter(sourceScene);

    return { sceneToUpdate, actionKey };
  };

  const onConnect = (connection: Connection) => {
    const sceneData = getSceneToUpdate(connection);
    if (!sceneData) {
      console.error("Connection error: scene data is null");
      return;
    }

    builderService
      .addSceneConnection({
        sourceSceneKey: sceneData.sceneToUpdate.key,
        destinationSceneKey: connection.target,
        actionKey: sceneData.actionKey,
      })
      .catch(handleError);

    // Optimistic update
    setEdges((prev) => addEdge(connection, prev));
  };

  const onConnectEnd = async (
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
      // Magic values that places the node over the correct handle:
      const offset = fromHandle ? { x: 0, y: 0 } : { x: 375 - 16, y: 27.5 };
      const scene = await addScene({
        payload: fromHandle
          ? DEFAULT_SCENE
          : {
              ...DEFAULT_SCENE,

              actions: [builderService.makeEmptyActionPayload()],
            },
        position: { x: position.x - offset.x, y: position.y - offset.y },
      });
      if (!scene) return;

      const fromNode = connectionState.fromNode.id;
      const toNode = scene.key;

      // TODO: here
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

      builderService
        .removeSceneConnection({
          sourceScene: sceneData.sceneToUpdate,
          actionKey: sceneData.actionKey,
          targetSceneKey: edge.target,
        })
        .catch(handleError);
    });
  };

  return { onConnect, onConnectEnd, onEdgesDelete };
};
