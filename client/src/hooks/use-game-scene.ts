import { useUpdateStoryProgress } from "@/game/hooks/use-update-story-progress";
import { getLocalRepository } from "@/lib/storage/dexie/indexed-db-repository";
import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useMemo } from "react";
import { useInitialQuery } from "./use-query";
import { useRemoteStoryProgress } from "./use-remote-story-progress";

export const useGameScene = ({
  sceneKey,
  gameKey,
}: {
  sceneKey: string;
  gameKey: string;
}) => {
  const repo = useMemo(() => getLocalRepository(), []);

  // Get data
  const scene = useLiveQuery(
    () => repo.getScene(sceneKey),
    [sceneKey, gameKey],
  );

  const getStoryProgress = useCallback(
    () => repo.getStoryProgress(gameKey),
    [gameKey, repo],
  );
  const initialProgress = useInitialQuery(getStoryProgress);

  // Update story progress
  const storyProgress = useUpdateStoryProgress({
    scene,
    storyProgress: initialProgress,
  });

  const { saveProgress } = useRemoteStoryProgress();

  return { scene, storyProgress, saveProgress };
};
