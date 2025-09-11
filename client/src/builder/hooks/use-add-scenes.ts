import { useBuilderContext } from "./use-builder-context";
import { useReactFlow, useStoreApi, XYPosition } from "@xyflow/react";
import { getBuilderService } from "@/get-builder-service";
import { makeSimpleSceneContent } from "@/lib/scene-content";
import { scenesToNodesAndEdgesAdapter } from "../adapters";
import { useBuilderError } from "./use-builder-error";
import { Scene } from "@/lib/storage/domain";
import { WithoutKey } from "@/types";
import { nanoid } from "nanoid";
import { useBuilderEditorStore } from "./use-scene-editor-store";
import { useMousePosition } from "@/hooks/use-mouse-position";

export type CreateScenePayload = Omit<WithoutKey<Scene>, "storyKey">;

export const DEFAULT_SCENE: CreateScenePayload = {
  title: "",
  content: makeSimpleSceneContent(""),
  actions: [],
  builderParams: { position: { x: 0, y: 0 } },
};

const lastWishedPos = { x: Infinity, y: Infinity };
const lastPlacement = { x: Infinity, y: Infinity };

export const useAddScenes = () => {
  const builderService = getBuilderService();
  const { handleError } = useBuilderError();
  const { screenToFlowPosition, addNodes, addEdges } = useReactFlow();
  const { getState, setState } = useStoreApi();
  const { resetSelectedElements } = getState();
  const { reactFlowRef, story } = useBuilderContext();
  const mousePosition = useMousePosition();
  const openSceneEditor = useBuilderEditorStore((state) => state.open);

  const getInitialPlacement = () => {
    if (!reactFlowRef.current)
      throw "Could not add scene, the builder is missing";
    // if the mouse is over the builder
    if (reactFlowRef.current.matches(":hover")) {
      return screenToFlowPosition(mousePosition);
    } else {
      const rect = reactFlowRef.current.getBoundingClientRect();
      // find the center
      const position = {
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2,
      };
      return screenToFlowPosition(position);
    }
  };

  // Offsets the scenes when there was already a scene pasted on the same spot last
  // This provides visual feedback for the scenes being added even if they would have overlapped
  // returns a relative position
  const computeOptimalPlacement = (
    newScenes: CreateScenePayload[],
    wishedPos: XYPosition,
  ): XYPosition => {
    const placement = structuredClone(wishedPos);
    if (
      Math.hypot(wishedPos.x - lastWishedPos.x, wishedPos.y - lastWishedPos.y) <
      40
    ) {
      // offsets the placement in case we already placed something close
      placement.x = lastPlacement.x + 40;
      placement.y = lastPlacement.y + 40;
    } else {
      lastWishedPos.x = wishedPos.x;
      lastWishedPos.y = wishedPos.y;
    }
    lastPlacement.x = placement.x;
    lastPlacement.y = placement.y;

    // figure out the top corner of the rectangle containing our nodes
    let topX = Infinity;
    let topY = Infinity;
    newScenes.forEach((scene) => {
      topX = Math.min(topX, scene.builderParams.position.x);
      topY = Math.min(topY, scene.builderParams.position.y);
    });
    if (Number.isFinite(topX)) placement.x -= topX;
    if (Number.isFinite(topY)) placement.y -= topY;

    return placement;
  };

  const addScenesToDB = (
    newScenes: CreateScenePayload[],
    placement: XYPosition,
  ) => {
    // promote the new scenes into future resident of the database
    const scenes = structuredClone(newScenes) as Scene[];
    const keys = scenes.map(() => nanoid());
    scenes.forEach((scene, i) => {
      scene.key = keys[i]!;
      scene.storyKey = story.key;
      // relative position to absolute position
      scene.builderParams.position = {
        x: scene.builderParams.position.x + placement.x,
        y: scene.builderParams.position.y + placement.y,
      };
      // in case the sceneKeys were defined relative to other scenes in the batch,
      // promote the relative indicies to absolute keys
      scene.actions.forEach((action) => {
        if (action.sceneKey && action.sceneKey[0] === "=") {
          const recipient = parseInt(action.sceneKey.slice(1));
          if (Number.isSafeInteger(recipient) && recipient < keys.length)
            action.sceneKey = keys[recipient];
        }
      });
    });
    // the scenes move to their new homes
    builderService.bulkUpdateScenes({ scenes });

    return scenes;
  };

  const updateFlow = (scenes: Scene[]) => {
    const [nodes, edges] = scenesToNodesAndEdgesAdapter({ scenes, story });
    resetSelectedElements();
    nodes.forEach((node) => {
      node.selected = true;
    });
    addNodes(nodes);
    addEdges(edges);

    if (scenes.length === 1) {
      const scene = scenes[0]!;
      openSceneEditor({
        type: "scene-editor",
        payload: {
          scene,
          isFirstScene: story.firstSceneKey === scene.key,
        },
      });
    } else {
      // FIXME: This triggers *before* the scenes are added to the dom
      // This is a problem because XYDrag expects the nodes to instantiated to listen for mouse events
      // As such it is not yet possible to immediatly drag newly added nodes
      setState({ nodesSelectionActive: true });
    }
  };

  const addScenes = (
    newScenes: CreateScenePayload[],
    position: XYPosition | "auto",
  ): Scene[] | null => {
    if (!newScenes.length) return [];
    if (position === "auto") position = getInitialPlacement();
    const placement = computeOptimalPlacement(newScenes, position);
    try {
      const scenes = addScenesToDB(newScenes, placement);
      updateFlow(scenes);
      return scenes;
    } catch (err) {
      handleError(err);
      return null;
    }
  };

  return { addScenes };
};
