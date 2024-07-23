import { client } from "@/lib/http-client/client";
import { StoryProgress } from "@/lib/storage/domain";
import { useCallback } from "react";

export const useRemoteStoryProgress = () => {
  const saveProgress = useCallback((payload: StoryProgress) => {
    client.PATCH("/api/synchronize/progress", {
      body: { ...payload, lastPlayedAt: payload.lastPlayedAt.toISOString() },
    });
  }, []);

  return { saveProgress };
};
