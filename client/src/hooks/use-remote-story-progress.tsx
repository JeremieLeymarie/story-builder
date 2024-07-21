import { StoryProgress } from "@/lib/storage/dexie/dexie-db";
import { useCallback } from "react";
import { apiSynchronizeProgress } from "@/lib/http-client";

export const useRemoteStoryProgress = () => {
  const saveProgress = useCallback((payload: StoryProgress) => {
    apiSynchronizeProgress({
      body: { ...payload, lastPlayedAt: payload.lastPlayedAt.toISOString() },
    });
  }, []);

  return { saveProgress };
};
