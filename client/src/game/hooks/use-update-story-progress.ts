import { Scene, StoryProgress } from "@/lib/storage/dexie/dexie-db";
import { getLocalRepository } from "@/lib/storage/dexie/indexed-db-repository";
import { useCallback, useEffect } from "react";

type Props = {
  scene?: Scene | null;
  storyProgress?: StoryProgress | null;
};

export const useUpdateStoryProgress = ({ scene, storyProgress }: Props) => {
  const updateStoryProgress = useCallback(
    async (progress: StoryProgress, scene: Scene) => {
      const payload = {
        ...progress,
        currentSceneKey: scene.key,
        lastPlayedAt: new Date(),
        history: [...progress!.history, scene.key],
      };

      await getLocalRepository().updateStoryProgress(payload);
    },
    [],
  );

  useEffect(() => {
    if (storyProgress && scene) updateStoryProgress(storyProgress, scene);
  }, [storyProgress, scene, updateStoryProgress]);
};
