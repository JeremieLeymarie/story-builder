import { useBuilderContext } from "./use-builder-context";
import { useReactFlow, XYPosition } from "@xyflow/react";
import { getBuilderService } from "@/get-builder-service";
import { SceneSchema } from "../components/scene-editor/schema";
import { makeSimpleSceneContent } from "@/lib/scene-content";
import { sceneToNodeAdapter } from "../adapters";
import { Scene } from "@/lib/storage/domain";

export const DEFAULT_SCENE: SceneSchema = {
  title: "",
  content: makeSimpleSceneContent(""),
  actions: [],
};

export const useAddScene = () => {
  const builderService = getBuilderService();
  const { story } = useBuilderContext();

  // TODO: does this re-render whenever the viewport changes
  const { screenToFlowPosition, setNodes } = useReactFlow();
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
  ): Promise<Scene> => {
    const scene = await builderService.addScene({
      ...keylessScene,
      storyKey: story.key,
      builderParams: { position },
    });
    setNodes((nds) => [...nds, sceneToNodeAdapter({ scene, story })]);
    return scene;
  };

  return { addScene };
};
