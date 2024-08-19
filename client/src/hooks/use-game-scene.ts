import { useUpdateStoryProgress } from "@/game/hooks/use-update-story-progress";
import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useMemo } from "react";
import { useInitialQuery } from "./use-query";
import { getLocalRepository } from "@/repositories";

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

  return { scene, storyProgress };
};
