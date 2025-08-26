import { useReactFlow } from "@xyflow/react";
import { BuilderNode } from "../types";
import { useBuilderContext } from "./use-builder-context";
import { getBuilderService } from "@/get-builder-service";
import { useBuilderError } from "./use-builder-error";
import { SceneUpdatePayload } from "../components/builder-editor-bar/scene-editor/schema";

export const useBuilderActions = () => {
  const { story } = useBuilderContext();
  const { setNodes } = useReactFlow<BuilderNode>();
  const { handleError } = useBuilderError();

  const builderService = getBuilderService();

  const updateScene = async (scene: SceneUpdatePayload) => {
    builderService.updateScene(scene).catch(handleError);

    setNodes((prev) =>
      prev.map((n) =>
        n.data.key === scene.key
          ? {
              ...n,
              data: {
                ...n.data,
                title: scene.title,
                content: scene.content,
                actions: scene.actions,
              },
            }
          : n,
      ),
    );
  };

  const setFirstScene = async (sceneKey: string) => {
    builderService.changeFirstScene(story.key, sceneKey).catch(handleError);
    setNodes((prev) =>
      prev.map((n) => ({
        ...n,
        data: { ...n.data, isFirstScene: n.data.key === sceneKey },
      })),
    );
  };

  return {
    updateScene,
    setFirstScene,
  };
};
