import { useReactFlow } from "@xyflow/react";
import { BuilderNode } from "../types";
import { useBuilderContext } from "./use-builder-context";
import { getBuilderService } from "@/get-builder-service";
import { SceneUpdatePayload } from "../components/scene-editor/schema";

export const useBuilderActions = () => {
  const { story } = useBuilderContext();
  const { getNodes, setNodes } = useReactFlow<BuilderNode>();

  const builderService = getBuilderService();

  const updateSceneContent = async (scene: SceneUpdatePayload) => {
    builderService.updateScene(scene);
    const nodes = getNodes();
    setNodes(
      nodes.map((n) =>
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
    // TODO: handle service errors
  };

  const setFirstScene = async (sceneKey: string) => {
    builderService.changeFirstScene(story.key, sceneKey);
    const nodes = getNodes();
    setNodes(
      nodes.map((n) => ({
        ...n,
        data: { ...n.data, isFirstScene: n.data.key === sceneKey },
      })),
    );
  };

  return {
    updateScene: updateSceneContent,
    setFirstScene,
  };
};
