import { MouseEvent, useEffect, useEffectEvent } from "react";
import { useBuilderEdges } from "./use-builder-edges";
import { BuilderNode, BuilderEdge } from "../types";
import { useBuilderShortCuts } from "./use-builder-shortcuts";
import { useBuilderContext } from "./use-builder-context";
import { useErrorToast } from "./use-error-toast";
import { useDeleteSceneStore } from "./use-delete-scenes-store";
import { toast } from "sonner";
import { OnBeforeDelete, useReactFlow } from "@xyflow/react";
import { useTutorial } from "./use-tutorial";

export const useBuilder = () => {
  const { story, builderService, initialNodes } = useBuilderContext();

  const { handleError } = useErrorToast();
  const { onConnect, onConnectEnd, onEdgesDelete } = useBuilderEdges();
  const { fitView } = useReactFlow();
  const openDeleteConfirm = useDeleteSceneStore((state) => state.open);
  const { start: startTutorial, isActive: isTutorialActive } = useTutorial();

  const handleWindowResize = useEffectEvent(() => {
    fitView();
  });

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  useBuilderShortCuts({ firstSceneKey: story.firstSceneKey });

  const onNodeDragStop = (_: MouseEvent, node: BuilderNode) => {
    builderService
      .updateSceneBuilderPosition(node.data.key, node.position)
      .catch(handleError);
  };

  const onBeforeNodesDelete: OnBeforeDelete<BuilderNode, BuilderEdge> = async ({
    nodes,
  }) => {
    if (nodes.length === 0) return true;
    if (nodes.some((n) => n.data.isFirstScene)) {
      toast.error("Cannot delete the first scene of the story");
      return false;
    }
    openDeleteConfirm(nodes.map((n) => n.data.key));
    return false;
  };

  const onInit = () => {
    if (initialNodes.length > 1) return;
    // We need to wait for nodes to be rendered and `fitView` to have focused on the main node
    setTimeout(() => {
      startTutorial("introduction");
    }, 500);
  };

  return {
    onNodeDragStop,
    onBeforeNodesDelete,
    onConnect,
    onConnectEnd,
    onEdgesDelete,
    onInit,
    controlsEnabled: !isTutorialActive,
  };
};
