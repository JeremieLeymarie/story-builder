import { useBuilderContext } from "./use-builder-context";
import { useReactFlow, XYPosition } from "@xyflow/react";
import { getBuilderService } from "@/get-builder-service";
import { sceneToNodeAdapter } from "../adapters";
import { Scene } from "@/lib/storage/domain";
import { useBuilderError } from "./use-builder-error";
import { makeSimpleLexicalContent } from "@/lib/lexical-content";
import { SceneSchema } from "../components/builder-editor-bar/scene-editor/schema";

export const DEFAULT_SCENE: SceneSchema = {
  title: "",
  content: makeSimpleLexicalContent(""),
  actions: [],
};

export const useAddScene = () => {
  const builderService = getBuilderService();
  const { handleError } = useBuilderError();
  const { story } = useBuilderContext();
  const { screenToFlowPosition, addNodes } = useReactFlow();
  const { reactFlowRef } = useBuilderContext();

  const getCenterPosition = () => {
    if (!reactFlowRef.current) return { x: 0, y: 0 };

    const rect = reactFlowRef.current.getBoundingClientRect();
    const position = {
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height / 2,
    };
    return screenToFlowPosition(position);
  };

  const addScene = async (
    position: XYPosition = getCenterPosition(),
    keylessScene: SceneSchema = DEFAULT_SCENE,
  ): Promise<Scene | null> => {
    try {
      const scene = await builderService.addScene({
        ...keylessScene,
        storyKey: story.key,
        builderParams: { position },
      });
      addNodes([sceneToNodeAdapter({ scene, story })]);
      return scene;
    } catch (err) {
      handleError(err);
      return null;
    }
  };

  return { addScene };
};
