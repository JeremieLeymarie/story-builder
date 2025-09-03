import { useBuilderContext } from "./use-builder-context";
import { useReactFlow, useStoreApi, XYPosition } from "@xyflow/react";
import { getBuilderService } from "@/get-builder-service";
import { makeSimpleSceneContent } from "@/lib/scene-content";
import { scenesToNodesAndEdgesAdapter } from "../adapters";
import { useBuilderError } from "./use-builder-error";
import { useMousePosition } from "@/hooks/use-mouse-position";
import { Scene } from "@/lib/storage/domain";
import { WithoutKey } from "@/types";
import { nanoid } from "nanoid";
import { useBuilderEditorStore } from "./use-scene-editor-store";

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
  const { story } = useBuilderContext();
  const { screenToFlowPosition, addNodes, addEdges } = useReactFlow();
  const { getState, setState } = useStoreApi();
  const { unselectNodesAndEdges } = getState();
  const { reactFlowRef } = useBuilderContext();
  const { getMousePosition } = useMousePosition();
  const openSceneEditor = useBuilderEditorStore((state) => state.open);

  const getInitialPlacement = () => {
    if (reactFlowRef.current?.matches(":hover")) {
      return screenToFlowPosition(getMousePosition());
    } else {
      if (!reactFlowRef.current) return { x: 0, y: 0 };

      const rect = reactFlowRef.current.getBoundingClientRect();
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

  const addScenes = (
    newScenes: NewScene[],
    position: XYPosition = getInitialPlacement(),
  ): Scene[] | null => {
    if (!newScenes.length) return [];
    computeEfficientPlacement(newScenes, position);

    try {
      // promote the new scenes into future resident of the database
      const scenes = structuredClone(newScenes) as Scene[];
      const idx2id = scenes.map(() => nanoid());
      scenes.forEach((scene, i) => {
        scene.key = idx2id[i]!;
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
            const sceneKey = parseInt(action.sceneKey.slice(1));
            if (Number.isSafeInteger(sceneKey) && sceneKey < idx2id.length)
              action.sceneKey = idx2id[sceneKey];
          }
        });
      });

      // update reactflow
      const [newNodes, newEdges] = scenesToNodesAndEdgesAdapter({
        scenes,
        story,
      });
      newNodes.forEach((node) => {
        node.selected = true;
      });
      unselectNodesAndEdges();
      addNodes(newNodes);
      addEdges(newEdges);
      setState({ nodesSelectionActive: true });

      if (scenes.length === 1) {
        const scene = scenes[0]!;
        openSceneEditor({
          type: "scene-editor",
          payload: {
            scene,
            isFirstScene: story.firstSceneKey === scene.key,
          },
        });
      }

      // the scenes move to their new homes
      builderService.bulkUpdateScenes({ scenes });

      return scenes;
    } catch (err) {
      handleError(err);
      return null;
    }
  };

  return { addScenes };
};
