import { useMutation } from "@tanstack/react-query";
import { useBuilderEditorStore } from "./use-builder-editor-store";
import { useDeleteSceneStore } from "./use-delete-scenes-store";
import { useErrorToast } from "./use-error-toast";
import { useBuilderContext } from "./use-builder-context";
import { useReactFlow } from "@xyflow/react";
import { BuilderEdge, BuilderNode } from "../types";
import { BuilderServicePort } from "@/domains/builder/ports/builder-service-port";
import {
  hashEdgeId,
  sceneToEdgesAdapter,
  sceneToNodeAdapter,
} from "../adapters";
import { useHandleActionTargetsError } from "./use-handle-action-targets-error";

export const useDeleteScenes = () => {
  const closeBuilderEditor = useBuilderEditorStore((state) => state.close);
  const closeDeleteConfirmation = useDeleteSceneStore((state) => state.close);
  const { handleError } = useErrorToast();
  const { story, builderService } = useBuilderContext();
  const { setNodes, setEdges } = useReactFlow<BuilderNode, BuilderEdge>();
  const handleActionTargetsError = useHandleActionTargetsError();

  const updateReactFlow = async (
    result: Awaited<ReturnType<BuilderServicePort["deleteScenes"]>>,
  ) => {
    // 1. Update scenes
    setNodes((nodes) =>
      nodes
        .map((n) => {
          const updatedScene = result.updatedScenes[n.data.key];
          if (updatedScene)
            return sceneToNodeAdapter({ scene: updatedScene, story });
          return n;
        })
        .filter((n) => !result.deletedSceneKeys.includes(n.data.key)),
    );

    // 2. Update connections
    const newEdges = Object.values(result.updatedScenes).flatMap((scene) => {
      return sceneToEdgesAdapter(scene);
    });
    const deletedEdgeIds = result.deletedConnections.map((connection) =>
      hashEdgeId({
        actionKey: connection.actionKey,
        sceneKey: connection.sourceSceneKey,
        targetSceneKey: connection.targetSceneKey,
      }),
    );
    setEdges((edges) =>
      edges
        .map((e) => {
          const newEdge = newEdges.find((newEdge) => newEdge.id === e.id);
          if (newEdge) return newEdge;
          return e;
        })
        .filter((e) => !deletedEdgeIds.includes(e.id)),
    );

    // 3. Compute potential targets probability errors
    Object.values(result.updatedScenes).forEach((scene) => {
      scene.actions.forEach((action) =>
        // Handle (add or remove) errors on action targets
        handleActionTargetsError(scene, action),
      );
    });
  };

  const { mutateAsync } = useMutation({
    mutationFn: async (sceneKeys: string[]) => {
      return builderService.deleteScenes({ storyKey: story.key, sceneKeys });
    },
    onSuccess: (result) => {
      updateReactFlow(result);
    },
    onSettled: () => {
      closeBuilderEditor();
      closeDeleteConfirmation();
    },
    onError: handleError,
  });

  return mutateAsync;
};
