import { API_URL } from "@/constants";
import { getRepository } from "@/lib/storage/indexed-db-repository";
import { useCallback } from "react";

type ToolbarProps = {
  storyId: number;
};

export const useToolbar = ({ storyId }: ToolbarProps) => {
  const synchronize = useCallback(async () => {
    // TODO: handle case where user doesn't have an account
    const data = await getRepository().getStory(storyId);

    await fetch(`${API_URL}/api/builder/save/game`, {
      body: JSON.stringify(data),
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
  }, [storyId]);
  return { synchronize };
};
