import { useReactFlow } from "@xyflow/react";
import { BuilderNode } from "../types";
import { useBuilderContext } from "./use-builder-context";
import { useBuilderError } from "./use-builder-error";
import { Scene } from "@/lib/storage/domain";
import { sceneToNodeAdapter } from "../adapters";
import { useBuilderEditorStore } from "./use-builder-editor-store";

export const useBuilderActions = () => {
  const { story, setStory, builderService } = useBuilderContext();
  const { setNodes } = useReactFlow<BuilderNode>();
  const { handleError } = useBuilderError();
  const updateSceneEditor = useBuilderEditorStore(
    (state) => state.updatePayload,
  );

  const updateScene = async (scene: Partial<Scene> & Pick<Scene, "key">) => {
    try {
      const updated = await builderService.updateScene(scene);
      if (!updated) return handleError(`Failed to update scene ${scene.key}`);
      setNodes((prev) =>
        prev.map((n) =>
          n.data.key === updated.key
            ? { ...n, data: sceneToNodeAdapter({ scene: updated, story }).data } // Only copy data to preserve UI states (selection for example)
            : n,
        ),
      );
      updateSceneEditor({
        type: "scene-editor",
        payload: {
          scene: updated,
          isFirstScene: story.firstSceneKey === updated.key,
        },
      });
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
