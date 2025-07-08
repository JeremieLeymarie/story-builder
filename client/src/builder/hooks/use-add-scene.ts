import { useBuilderContext } from "./use-builder-store";
import { SceneEditorSchema } from "../components/editors/scene-editor";
import { useReactFlow, useStoreApi } from "@xyflow/react";
import { getBuilderService } from "@/get-builder-service";

export const useAddScene = () => {
  const builderService = getBuilderService();
  const { refresh, story, nodes } = useBuilderContext();
  const reactFlowStore = useStoreApi();

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

  const addScene = async (scene: SceneEditorSchema) => {
    const newScene = await builderService.addScene({
      ...scene,
      storyKey: story.key,
      builderParams: { position: getCenterPosition() },
    });
    console.log({ newScene, nodes });
    await refresh();
    console.log("after refresh", nodes);
    const { addSelectedNodes } = reactFlowStore.getState();
    addSelectedNodes([newScene.key]);
  };

  return { addScene };
};
