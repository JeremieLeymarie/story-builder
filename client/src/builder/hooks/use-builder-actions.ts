import { useReactFlow } from "@xyflow/react";
import { BuilderEdge, BuilderNode } from "../types";
import { useBuilderContext } from "./use-builder-context";
import { useErrorToast } from "./use-error-toast";
import { Scene } from "@/lib/storage/domain";
import { sceneToEdgesAdapter, sceneToNodeAdapter } from "../adapters";

export const useBuilderActions = () => {
  const { story, setStory, builderService } = useBuilderContext();
  const { setNodes, updateEdgeData } = useReactFlow<BuilderNode, BuilderEdge>();
  const { handleError } = useErrorToast();

  const updateScene = async (scene: Partial<Scene> & Pick<Scene, "key">) => {
    try {
      const updated = await builderService.updateScene(scene);
      if (!updated) return handleError(`Failed to update scene ${scene.key}`);
      const node = sceneToNodeAdapter({ scene: updated, story });
      setNodes((prev) =>
        prev.map((n) =>
          n.data.key === updated.key
            ? { ...n, data: node.data } // Only copy data to preserve UI states (selection for example)
            : n,
        ),
      );

      const edges = sceneToEdgesAdapter(updated);
      edges.forEach((edge) => updateEdgeData(edge.id, edge.data));
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
    makeEmptyActionPayload: builderService.makeEmptyActionPayload,
  };
};
