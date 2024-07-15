import { ErrorMessage, Loader } from "@/design-system/components";
import { GameScene } from "@/game/components/scene";
import { useUpdateStoryProgress } from "@/game/hooks/use-update-story-progress";
import { useInitialQuery } from "@/hooks/use-query";
import { getLocalRepository } from "@/lib/storage/dexie/indexed-db-repository";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { useCallback } from "react";

export const Component = () => {
  const { sceneId, gameId } = Route.useParams();
  const repo = getLocalRepository();
  const scene = useLiveQuery(() => repo.getScene(sceneId), [sceneId, gameId]);
  const getStoryProgress = useCallback(
    () => repo.getStoryProgress(gameId),
    [gameId, repo],
  );
  const storyProgress = useInitialQuery(getStoryProgress);

  useUpdateStoryProgress({ scene, storyProgress });

  if (scene === undefined || storyProgress === undefined) {
    return <Loader />;
  }

  if (scene === null || storyProgress === null) {
    console.error("Error while loading scene: ", scene);
    return <ErrorMessage />;
  }

  return <GameScene {...scene} />;
};

export const Route = createFileRoute("/game/$gameId/$sceneId")({
  parseParams: ({ gameId, sceneId }) => {
    return { gameId: parseInt(gameId), sceneId: parseInt(sceneId) };
  },
  component: Component,
});
