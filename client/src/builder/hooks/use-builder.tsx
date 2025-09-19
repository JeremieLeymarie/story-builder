import { MouseEvent } from "react";
import { useBuilderEdges } from "./use-builder-edges";
import { BuilderNode } from "../types";
import { useBuilderShortCuts } from "./use-builder-shortcuts";
import { useBuilderContext } from "./use-builder-context";
import { getBuilderService } from "@/get-builder-service";
import { useBuilderError } from "./use-builder-error";
import { toast } from "sonner";
import { Edge, OnBeforeDelete } from "@xyflow/react";

export const useBuilder = () => {
  const { story } = useBuilderContext();

  const { handleError } = useBuilderError();
  const builderService = getBuilderService();
  const { onConnect, onConnectEnd, onEdgesDelete } = useBuilderEdges();

  useBuilderShortCuts({ firstSceneKey: story.firstSceneKey });

  const onNodeDragStop = (_: MouseEvent, node: BuilderNode) => {
    builderService
      .updateSceneBuilderPosition(node.data.key, node.position)
      .catch(handleError);
  };

  const onBeforeNodesDelete: OnBeforeDelete<BuilderNode, Edge> = async ({
    nodes,
  }) => {
    if (nodes.find((n) => n.data.isFirstScene)) {
      toast.error("Cannot delete the first scene of the story");
      return false;
    }
    builderService
      .deleteScenes({
        sceneKeys: nodes.map(({ data: { key } }) => key),
        storyKey: story.key,
      })
      .catch(handleError);
    return true;
  };

  return {
    onNodeDragStop,
    onBeforeNodesDelete,
    onConnect,
    onConnectEnd,
    onEdgesDelete,
  };
};
