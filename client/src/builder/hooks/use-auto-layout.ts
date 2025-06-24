import { useReactFlow } from "@xyflow/react";
import { BuilderNode } from "../types";
import { useRef } from "react";
import { Scene } from "@/lib/storage/domain";
import { useBuilderContext } from "./use-builder-store";
import { getBuilderService } from "@/get-builder-service";

export const useAutoLayout = () => {
  const { getNodes, getEdges } = useReactFlow<BuilderNode>();
  const stateBeforeChanges = useRef<Scene[]>(null);
  const { story, refresh } = useBuilderContext();
  const svc = getBuilderService();

  const organizeNodes = async () => {
    const { before, after } = await svc.getAutoLayout({
      storyKey: story.key,
      edges: getEdges(),
      nodes: getNodes(),
    });

    stateBeforeChanges.current = JSON.parse(JSON.stringify(before)); // Deep copy

    await svc.bulkUpdateScenes({ scenes: after });
    refresh();
  };

  const revertChanges = async () => {
    if (!stateBeforeChanges.current) {
      throw new Error(
        "The previous state should always be set when reverting to previous state",
      );
    }
    await svc.bulkUpdateScenes({ scenes: stateBeforeChanges.current });
    refresh();
  };

  return { organizeNodes, revertChanges };
};
