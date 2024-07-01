import { API_URL } from "@/constants";
import { getRepository } from "@/lib/storage/indexed-db-repository";
import { useCallback } from "react";

type ToolbarProps = {
  storyId: number;
};

export const useToolbar = ({ storyId }: ToolbarProps) => {
  const synchronize = useCallback(async () => {
    const repo = getRepository();
    const story = await repo.getStory(storyId);
    const scenes = await repo.getScenes(storyId);

    await fetch(`${API_URL}/api/builder/save/game`, {
      body: JSON.stringify({ story, scenes }),
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
  }, [storyId]);

  return { synchronize };
};
