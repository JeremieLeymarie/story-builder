import {
  Connection,
  FinalConnectionState,
  useReactFlow,
  addEdge,
} from "@xyflow/react";
import { BuilderEdge, BuilderNode } from "../types";
import { useBuilderError } from "./use-builder-error";
import { DEFAULT_SCENE, useAddScene } from "./use-add-scene";
import { useBuilderContext } from "./use-builder-context";
import { Scene } from "@/lib/storage/domain";

const edgeHasSiblings = (action: Scene["actions"][number]) =>
  action.targets.length > 1;

const isEdgeFromAction = (edge: BuilderEdge, actionKey: string) =>
  edge.sourceHandle === actionKey;

// TODO: test this
export const useBuilderEdges = () => {
  const { setEdges } = useReactFlow<BuilderNode, BuilderEdge>();
  const { handleError } = useBuilderError();
  const { addScene } = useAddScene();
  const { screenToFlowPosition } = useReactFlow();
  const { builderService } = useBuilderContext();

  const onConnect = async (connection: Connection) => {
    const sourceSceneKey = connection.source;
    const sourceActionKey = connection.sourceHandle;
    const targetSceneKey = connection.target;

    if (!sourceActionKey)
      throw new Error("Unable to get action: connection has no source handle");

    try {
      // Persist connection
      const scene = await builderService.addSceneConnection({
        sourceSceneKey,
        destinationSceneKey: targetSceneKey,
        actionKey: sourceActionKey,
      });
      const action = scene.actions.find((a) => a.key === sourceActionKey);
      if (!action) throw new Error("New action should be created");

      // Update React Flow
      setEdges((prev) => {
        // Set `hasSiblings: true` for other edges coming from the same action
        const updatedEdges = prev.map((e) =>
          isEdgeFromAction(e, sourceActionKey)
            ? { ...e, data: { ...e.data!, hasSiblings: true } }
            : e,
        );
        // Add new edge
        return addEdge<BuilderEdge>(
          {
            ...connection,
            type: "edge",
            data: {
              probability:
                action.targets.find((t) => t.sceneKey === sourceActionKey)
                  ?.probability ?? 100, // TODO: handle error?
              hasSiblings: action.targets.length > 1,
            },
          },
          updatedEdges,
        );
      });
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

  const onEdgesDelete = (edges: BuilderEdge[]) => {
    edges.forEach((edge) => {
      const sourceSceneKey = edge.source;
      const sourceActionKey = edge.sourceHandle;
      const targetSceneKey = edge.target;

      if (!sourceActionKey)
        throw new Error("Unable to get action: edge has no source handle");

      builderService
        .removeSceneConnection({
          sourceSceneKey,
          actionKey: sourceActionKey,
          targetSceneKey: targetSceneKey,
        })
        .then((scene) => {
          const sourceAction = scene.actions.find(
            (a) => a.key === sourceActionKey,
          );
          if (!sourceAction)
            throw new Error(`Action not found for edge ${edge.id}`);

          setEdges((prev) =>
            prev.map((e) =>
              isEdgeFromAction(e, sourceActionKey)
                ? {
                    ...e,
                    data: {
                      ...e.data!,
                      hasSiblings: edgeHasSiblings(sourceAction),
                    },
                  }
                : e,
            ),
          );
        })
        .catch(handleError);
    });
  };

  return { onConnect, onConnectEnd, onEdgesDelete };
};
