import { client } from "@/lib/http-client/client";
import { StoryProgress } from "@/lib/storage/domain";
import { getLocalRepository } from "@/repositories/indexed-db-repository";
import { useCallback, useState } from "react";

export const useSaveStoryProgress = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const saveProgress = useCallback(async (payload: StoryProgress) => {
    const user = await getLocalRepository().getUser();

    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    client.PATCH("/api/synchronize/progress", {
      body: {
        ...payload,
        lastPlayedAt: payload.lastPlayedAt.toISOString(),
        userKey: user.key,
      },
    });
  }, []);

  return { saveProgress, isAuthModalOpen, setIsAuthModalOpen };
};
