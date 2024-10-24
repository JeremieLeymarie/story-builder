import { useUpdateStoryProgress } from "@/game/hooks/use-update-story-progress";
import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useMemo } from "react";
import { getLocalRepository } from "@/repositories";
import { useQuery } from "@tanstack/react-query";

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
    () => repo.getStoryProgresses(gameKey),
    [gameKey, repo],
  );

  const { data: initialProgress } = useQuery({
    queryFn: getStoryProgress,
    queryKey: ["story-progress"],
  });

  // Update story progress
  const storyProgress = useUpdateStoryProgress({
    scene,
    storyProgress: initialProgress,
  });

  return { scene, storyProgress };
};
