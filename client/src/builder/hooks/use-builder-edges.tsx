import { Connection, FinalConnectionState, useReactFlow } from "@xyflow/react";
import { BuilderEdge, BuilderNode } from "../types";
import { useErrorToast } from "./use-error-toast";
import { DEFAULT_SCENE, useAddScene } from "./use-add-scene";
import { useBuilderContext } from "./use-builder-context";
import { Scene } from "@/lib/storage/domain";
import {
  sceneToEdgesAdapter,
  sceneToNodeAdapter,
  targetToEdgeAdapter,
} from "../adapters";
import { useQueryClient } from "@tanstack/react-query";
import { makeGetSceneQueryOptions } from "./use-get-scene";
import { useHandleActionTargetsError } from "./use-handle-action-targets-error";
import { NODE_WIDTH } from "../components/nodes";

// TODO: test this
export const useBuilderEdges = () => {
  const { updateNodeData, updateEdgeData, addEdges, screenToFlowPosition } =
    useReactFlow<BuilderNode, BuilderEdge>();
  const { handleError } = useErrorToast();
  const { addScene } = useAddScene();
  const { builderService, story } = useBuilderContext();
  const queryClient = useQueryClient();
  const handleActionTargetsError = useHandleActionTargetsError();

  const _updateNodeAndEdges = (updatedScene: Scene) => {
    const node = sceneToNodeAdapter({ scene: updatedScene, story });
    const edges = sceneToEdgesAdapter(updatedScene);

    // This is a little naive, maybe batching these updates in setEdges + setNodes calls would be better for performance
    updateNodeData(node.id, node.data);
    edges.forEach((edge) => updateEdgeData(edge.id, edge.data));
  };

  const onConnect = async (connection: Connection) => {
    const sourceSceneKey = connection.source;
    const sourceActionKey = connection.sourceHandle;
    const targetSceneKey = connection.target;

    if (!sourceActionKey)
      throw new Error("Unable to get action: connection has no source handle");

    try {
      // Persist connection
      const { updatedScene, addedConnection } =
        await builderService.addSceneConnection({
          sourceSceneKey,
          destinationSceneKey: targetSceneKey,
          actionKey: sourceActionKey,
        });
      // No need to update react flow if the connection already existed
      if (!addedConnection) return;

      const action = updatedScene.actions.find(
        (a) => a.key === sourceActionKey,
      )!;
      const target = action.targets.find((t) => t.sceneKey === targetSceneKey)!;
      const edge = targetToEdgeAdapter({
        target,
        action,
        sceneKey: sourceSceneKey,
      });

      // Update React Flow
      addEdges([edge]);
      _updateNodeAndEdges(updatedScene);
      // Handle (add or remove) errors on action targets
      handleActionTargetsError(updatedScene, action);

      // Invalidate scene queries used in builder editor
      const queryKey = makeGetSceneQueryOptions(sourceSceneKey).queryKey;
      queryClient.invalidateQueries({ queryKey });
    } catch (e) {
      handleError(e);
    }
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
        position: { x: position.x - NODE_WIDTH - 16, y: position.y - 27.5 },
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

  const onEdgesDelete = async (edges: BuilderEdge[]) => {
    try {
      const updatedScenesByKey = await builderService.removeSceneConnections(
        edges.map((edge) => {
          const sourceSceneKey = edge.source;
          const sourceActionKey = edge.sourceHandle;
          const targetSceneKey = edge.target;

          if (!sourceActionKey)
            throw new Error("Unable to get action: edge has no source handle");

          return {
            sourceSceneKey,
            actionKey: sourceActionKey,
            targetSceneKey: targetSceneKey,
          };
        }),
      );

      Object.values(updatedScenesByKey).forEach((scene) => {
        // Update React Flow
        _updateNodeAndEdges(scene);
        scene.actions.forEach((action) =>
          // Handle (add or remove) errors on action targets
          handleActionTargetsError(scene, action),
        );
      });
      // Invalidate scene queries used in builder editor
      edges.forEach((edge) => {
        const sourceSceneKey = edge.source;
        const queryKey = makeGetSceneQueryOptions(sourceSceneKey).queryKey;
        queryClient.invalidateQueries({ queryKey });
      });
    } catch (err) {
      handleError(err);
    }
  };

  return { onConnect, onConnectEnd, onEdgesDelete };
};
