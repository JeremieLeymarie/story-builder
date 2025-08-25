import { useReactFlow } from "@xyflow/react";
import { BuilderNode } from "../types";
import { useRef } from "react";
import { Scene } from "@/lib/storage/domain";
import { useBuilderContext } from "./use-builder-context";
import { getBuilderService } from "@/get-builder-service";
import { useBuilderError } from "./use-builder-error";
import { scenesToNodesAndEdgesAdapter } from "../adapters";

export const useAutoLayout = () => {
  const { setNodes, setEdges, getNodes, getEdges, fitView } =
    useReactFlow<BuilderNode>();
  const stateBeforeChanges = useRef<Scene[]>(null);
  const { story } = useBuilderContext();
  const svc = getBuilderService();
  const { handleError } = useBuilderError();

  const updateOptimistically = (scenes_: Scene[]) => {
    const [nodes, scenes] = scenesToNodesAndEdgesAdapter({
      scenes: scenes_,
      story,
    });
    setNodes(nodes);
    setEdges(scenes);
  };

  const organizeNodes = async () => {
    const { before, after } = await svc.getAutoLayout({
      storyKey: story.key,
      edges: getEdges(),
      nodes: getNodes(),
    });

    stateBeforeChanges.current = JSON.parse(JSON.stringify(before)); // Deep copy

    svc.bulkUpdateScenes({ scenes: after }).catch(handleError);
    updateOptimistically(after);
    fitView();
  };

  const revertChanges = async () => {
    if (!stateBeforeChanges.current) {
      throw new Error(
        "The previous state should always be set when reverting to previous state",
      );
    }
    svc
      .bulkUpdateScenes({ scenes: stateBeforeChanges.current })
      .catch(handleError);
    updateOptimistically(stateBeforeChanges.current);
    fitView();
  };

  return { organizeNodes, revertChanges };
};
