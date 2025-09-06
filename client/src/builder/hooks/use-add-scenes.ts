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

export type NewScene = Omit<WithoutKey<Scene>, "storyKey">;

export const DEFAULT_SCENE: NewScene = {
  title: "",
  content: makeSimpleSceneContent(""),
  actions: [],
  builderParams: { position: { x: 0, y: 0 } },
};

const last = { x: Infinity, y: Infinity };
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
    if (reactFlowRef.current?.matches(":hover")) {
      return screenToFlowPosition(mousePosition);
    } else {
      if (!reactFlowRef.current) return { x: 0, y: 0 };

      const rect = reactFlowRef.current.getBoundingClientRect();
      // find the center
      const position = {
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2,
      };
      return screenToFlowPosition(position);
    }
  };

  const computeEfficientPlacement = (
    newScenes: NewScene[],
    position: XYPosition,
  ) => {
    if (Math.hypot(position.x - last.x, position.y - last.y) < 40) {
      // offsets the placement in case we already placed something close
      position.x = lastPlacement.x + 40;
      position.y = lastPlacement.y + 40;
    } else {
      last.x = position.x;
      last.y = position.y;
    }
    lastPlacement.x = position.x;
    lastPlacement.y = position.y;

    // figure out the top corner of the rectangle containing our nodes
    let topX = Infinity;
    let topY = Infinity;
    newScenes.forEach((scene) => {
      topX = Math.min(topX, scene.builderParams.position.x);
      topY = Math.min(topY, scene.builderParams.position.y);
    });
    if (Number.isFinite(topX)) position.x -= topX;
    if (Number.isFinite(topY)) position.y -= topY;
  };

  const addScenesToDB = (newScenes: NewScene[], position: XYPosition) => {
    // promote the new scenes into future resident of the database
    const scenes = structuredClone(newScenes) as Scene[];
    const keys = scenes.map(() => nanoid());
    scenes.forEach((scene, i) => {
      scene.key = keys[i]!;
      scene.storyKey = story.key;
      // relative position to absolute position
      scene.builderParams.position = {
        x: scene.builderParams.position.x + position.x,
        y: scene.builderParams.position.y + position.y,
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

  const updateFrontend = (scenes: Scene[]) => {
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
    newScenes: NewScene[],
    position: XYPosition = getInitialPlacement(),
  ): Scene[] | null => {
    if (!newScenes.length) return [];
    computeEfficientPlacement(newScenes, position);
    try {
      const scenes = addScenesToDB(newScenes, position);
      updateFrontend(scenes);
      return scenes;
    } catch (err) {
      handleError(err);
      return null;
    }
  };

  return { addScenes };
};
