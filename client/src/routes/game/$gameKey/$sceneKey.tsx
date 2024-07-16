import { ErrorMessage, Loader } from "@/design-system/components";
import { GameScene } from "@/game/components/scene";
import { useUpdateStoryProgress } from "@/game/hooks/use-update-story-progress";
import { useInitialQuery } from "@/hooks/use-query";
import { useRemoteStoryProgress } from "@/hooks/use-remote-story-progress";
import { getLocalRepository } from "@/lib/storage/dexie/indexed-db-repository";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { useCallback } from "react";

export const Component = () => {
  const { sceneKey, gameKey } = Route.useParams();
  const repo = getLocalRepository();
  const scene = useLiveQuery(
    () => repo.getScene(sceneKey),
    [sceneKey, gameKey],
  );
  const getStoryProgress = useCallback(
    () => repo.getStoryProgress(gameKey),
    [gameKey, repo],
  );
  const storyProgress = useInitialQuery(getStoryProgress);
  const { saveProgress } = useRemoteStoryProgress();

  useUpdateStoryProgress({ scene, storyProgress });

  if (scene === undefined || storyProgress === undefined) {
    return <Loader />;
  }

  if (scene === null || storyProgress === null) {
    console.error("Error while loading scene: ", scene);
    return <ErrorMessage />;
  }

  const { key, ...sceneWithoutKey } = scene;
  return (
    <GameScene
      {...sceneWithoutKey}
      sceneKey={key}
      saveProgress={() => saveProgress(storyProgress)}
    />
  );
};

export const Route = createFileRoute("/game/$gameKey/$sceneKey")({
  component: Component,
});
