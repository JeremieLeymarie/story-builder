import { useBuilderContext } from "./use-builder-context";
import { useReactFlow, useStoreApi } from "@xyflow/react";
import { getBuilderService } from "@/get-builder-service";
import { useBuilderError } from "./use-builder-error";
import { BuilderPosition, Scene } from "@/lib/storage/domain";
import { useBuilderEditorStore } from "./use-scene-editor-store";
import { scenesToNodesAndEdgesAdapter } from "../adapters";
import { addPositions, subtractPositions } from "../position";
import { useGetNewScenePosition } from "./use-get-new-scene-position";

export type DuplicateScenePayload = Omit<Scene, "storyKey">;

const positionOffset: BuilderPosition = { x: 0, y: 0 };
let lastInitialPosition: BuilderPosition | null = null;

export const useDuplicateScenes = () => {
  const builderService = getBuilderService();
  const { handleError } = useBuilderError();
  const { addNodes, addEdges } = useReactFlow();
  const { getState, setState } = useStoreApi();
  const { resetSelectedElements } = getState();
  const { story } = useBuilderContext();
  const openSceneEditor = useBuilderEditorStore((state) => state.open);
  const { getNewScenePosition: getInitialPosition } = useGetNewScenePosition();

  const findLeftMostPositionInBatch = (
    originalScenes: DuplicateScenePayload[],
  ): BuilderPosition => {
    let topX = Infinity;
    let topY = Infinity;
    originalScenes.forEach((scene) => {
      topX = Math.min(topX, scene.builderParams.position.x);
      topY = Math.min(topY, scene.builderParams.position.y);
    });

    return { x: topX, y: topY };
  };

  const getOffset = ({
    initialPosition,
    originalScenes,
  }: {
    initialPosition: BuilderPosition;
    originalScenes: DuplicateScenePayload[];
  }) => {
    // `offsetFromOriginalScene` represents the offset between the left-most original scene and the initial position (mouse cursor or center of the flow)
    const offsetFromOriginalScene = subtractPositions(
      initialPosition,
      findLeftMostPositionInBatch(originalScenes),
    );

    const isLastPlacedSceneTooClose =
      lastInitialPosition &&
      Math.hypot(
        initialPosition.x - lastInitialPosition.x,
        initialPosition.y - lastInitialPosition.y,
      ) < 40;

    // `positionOffset` represents the offset from the previously created batch of scenes, to avoid stacking them up visually
    if (isLastPlacedSceneTooClose) {
      positionOffset.x += 40;
      positionOffset.y += 40;
      return addPositions(offsetFromOriginalScene, positionOffset);
    }

    return offsetFromOriginalScene;
  };

  const updateFlow = (scenes: DuplicateScenePayload[]) => {
    const [nodes, edges] = scenesToNodesAndEdgesAdapter({
      scenes: scenes.map((scene) => ({ ...scene, storyKey: story.key })),
      story,
    });

    resetSelectedElements();
    nodes.forEach((node) => (node.selected = true));
    addNodes(nodes);
    addEdges(edges);
    setState({ nodesSelectionActive: false });
  };

  // TODO: error management
  const duplicateScenes = async (
    originalScenes: DuplicateScenePayload[],
  ): Promise<Scene[] | null> => {
    if (!originalScenes.length) return [];
    const initialPosition = getInitialPosition();
    const offset = getOffset({
      initialPosition,
      originalScenes,
    });
    lastInitialPosition = initialPosition;

    const newPositions = originalScenes.reduce(
      (acc, scene) => ({
        ...acc,
        [scene.key]: addPositions(scene.builderParams.position, offset),
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
      if (scenes.length === 1)
        openSceneEditor({
          type: "scene-editor",
          payload: { scene: scenes[0]!, isFirstScene: false },
        });

      return scenes;
    } catch (err) {
      handleError(err);
      return null;
    }
  };

  return { duplicateScenes };
};
