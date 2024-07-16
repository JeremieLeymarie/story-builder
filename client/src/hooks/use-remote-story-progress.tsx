import { API_URL } from "@/constants";
import { StoryProgress } from "@/lib/storage/dexie/dexie-db";
import { useCallback } from "react";

type SaveProgressBody = {
  remoteId?: string;
};

export const useRemoteStoryProgress = () => {
  const saveProgress = useCallback((payload: StoryProgress) => {
    fetch(`${API_URL}/api/synchronize/progress`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }, []);

  return { saveProgress };
};
