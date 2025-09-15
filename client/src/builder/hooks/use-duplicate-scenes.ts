import { useBuilderContext } from "./use-builder-context";
import { getBuilderService } from "@/get-builder-service";
import { useBuilderError } from "./use-builder-error";
import { BuilderPosition, Scene } from "@/lib/storage/domain";
import { useGetNewScenePosition } from "./use-get-new-scene-position";
import { scenesToNodesAndEdgesAdapter } from "../adapters";
import { useAddFocussedNodes } from "./use-add-focussed-nodes";
import { useReactFlow } from "@xyflow/react";
import { StorylessScene } from "../types";
import { useSmartOffset } from "./use-smart-offset";
import { Vec2 } from "../position";

export const useDuplicateScenes = () => {
  const builderService = getBuilderService();
  const { handleError } = useBuilderError();
  const { story } = useBuilderContext();
  const { getNewScenePosition: getInitialPosition } = useGetNewScenePosition();
  const addNodes = useAddFocussedNodes();
  const { addEdges } = useReactFlow();
  const getOffset = useSmartOffset();

  const updateFlow = (scenes: StorylessScene[]) => {
    const [nodes, edges] = scenesToNodesAndEdgesAdapter({
      scenes: scenes.map((scene) => ({ ...scene, storyKey: story.key })),
      story,
    });

    addNodes(nodes);
    addEdges(edges);
  };

  // TODO: error management
  const duplicateScenes = async (
    originalScenes: StorylessScene[],
  ): Promise<Scene[] | null> => {
    if (!originalScenes.length) return [];
    const initialPosition = getInitialPosition();
    const offset = getOffset({
      desiredPosition: Vec2.from(initialPosition),
      scenes: originalScenes,
    });

    const newPositions = originalScenes.reduce(
      (acc, scene) => ({
        ...acc,
        [scene.key]: Vec2.from(scene.builderParams.position).add(offset),
      }),
      {} as Record<string, BuilderPosition>,
    );

    try {
      const scenes = await builderService.duplicateScenes({
        newPositions,
        originalScenes,
        storyKey: story.key,
      });

      updateFlow(scenes);
      return scenes;
    } catch (err) {
      handleError(err);
      return null;
    }
  };

  return { duplicateScenes };
};
