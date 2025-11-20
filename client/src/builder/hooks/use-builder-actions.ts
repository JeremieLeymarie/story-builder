import { useReactFlow } from "@xyflow/react";
import { BuilderNode } from "../types";
import { useBuilderContext } from "./use-builder-context";
import { getBuilderService } from "@/get-builder-service";
import { useBuilderError } from "./use-builder-error";
import { Scene } from "@/lib/storage/domain";
import { sceneToNodeAdapter } from "../adapters";

export const useBuilderActions = () => {
  const { story, setStory } = useBuilderContext();
  const { setNodes } = useReactFlow<BuilderNode>();
  const { handleError } = useBuilderError();

  const builderService = getBuilderService();

  const updateScene = async (scene: Partial<Scene> & Pick<Scene, "key">) => {
    try {
      const updated = await builderService.updateScene(scene);
      if (!updated) return handleError(`Failed to update scene ${scene.key}`);
      setNodes((prev) =>
        prev.map((n) =>
          n.data.key === updated.key
            ? sceneToNodeAdapter({ scene: updated, story })
            : n,
        ),
      );
    } catch (err) {
      handleError(err);
    }
  };

  const setFirstScene = (sceneKey: string) => {
    builderService.changeFirstScene(story.key, sceneKey).catch(handleError);
    setStory({ ...story, firstSceneKey: sceneKey });
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
