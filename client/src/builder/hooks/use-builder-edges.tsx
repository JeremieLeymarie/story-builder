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
    if (!connectionState.fromNode)
      throw new Error(
        "Could not create connection because there is no source node",
      );
    // A connection is valid when it ends on a target. In that case we don't want to add a new scene
    if (connectionState.isValid) return;

    const event = "changedTouches" in ev ? ev.changedTouches[0] : ev;
    if (!event) return;

    const isFromRightSide = !!connectionState.fromHandle?.id;
    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    if (isFromRightSide) {
      const scene = await addScene({
        payload: DEFAULT_SCENE,
        position,
      });
      if (!scene) return;
      onConnect({
        source: connectionState.fromNode.id,
        target: scene.key,
        sourceHandle: connectionState.fromHandle!.id!,
        targetHandle: null,
      });
    } else {
      const scene = await addScene({
        payload: {
          ...DEFAULT_SCENE,
          actions: [builderService.makeEmptyActionPayload()],
        },
        // Magic values that places the node over the correct handle:
        position: { x: position.x - 375 - 16, y: position.y - 27.5 },
      });
      if (!scene) return;
      // Create the connection from the newly created scene
      onConnect({
        source: scene.key,
        target: connectionState.fromNode.id,
        sourceHandle: scene.actions[0]!.key,
        targetHandle: null,
      });
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
