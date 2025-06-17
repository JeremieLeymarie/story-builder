import { getBuilderService } from "@/services";
import { useBuilderContext } from "./use-builder-store";
import { SceneEditorSchema } from "../components/editors/scene-editor";
import { useReactFlow } from "@xyflow/react";

export const useAddScene = () => {
  const builderService = getBuilderService();
  const { refresh, story } = useBuilderContext();

  const reactFlowInstance = useReactFlow();

  const { reactFlowRef } = useBuilderContext();

  const getCenterPosition = () => {
    if (!reactFlowRef.current) return { x: 0, y: 0 };

    const rect = reactFlowRef.current.getBoundingClientRect();
    const position = {
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height / 2,
    };
    return reactFlowInstance.screenToFlowPosition(position);
  };

  const addScene = (scene: SceneEditorSchema) => {
    builderService.addScene({
      ...scene,
      storyKey: story.key,
      builderParams: { position: getCenterPosition() },
    });
    refresh();
  };

  return { addScene };
};
