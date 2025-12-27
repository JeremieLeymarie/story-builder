import { useBuilderContext } from "./use-builder-context";
import { useBuilderError } from "./use-builder-error";
import { BuilderPosition, Scene } from "@/lib/storage/domain";
import { useScenePositioning } from "./use-scene-positioning";
import { scenesToNodesAndEdgesAdapter } from "../adapters";
import { useAddFocusedNodes } from "./use-add-focused-nodes";
import { useReactFlow } from "@xyflow/react";
import { StorylessScene } from "../types";
import { Vec2 } from "@/lib/vec2";

export const useDuplicateScenes = () => {
  const { handleError } = useBuilderError();
  const { story, builderService } = useBuilderContext();
  const { getNewScenePosition: getInitialPosition, getOffset } =
    useScenePositioning();
  const addNodes = useAddFocusedNodes();
  const { addEdges } = useReactFlow();

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
