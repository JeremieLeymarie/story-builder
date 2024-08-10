import { ErrorMessage, Loader } from "@/design-system/components";
import { GameScene } from "@/game/components/scene";
import { StoryProgress } from "@/lib/storage/domain";
import { getGameService } from "@/services";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";

export const Component = () => {
  const { gameKey } = Route.useParams();
  const { getOrCreateStoryProgress, getFirstSceneData } = getGameService();

  const { story, scene } = useLiveQuery(() => getFirstSceneData(gameKey)) ?? {};
  const [storyProgress, setStoryProgress] = useState<StoryProgress | null>();

  useEffect(() => {
    if (story)
      getOrCreateStoryProgress(story).then((progress) =>
        setStoryProgress(progress ?? null),
      );
  }, [getOrCreateStoryProgress, story]);

  if (
    story === undefined ||
    scene === undefined ||
    storyProgress === undefined
  ) {
    return <Loader />;
  }
  if (story === null || scene === null || storyProgress === null) {
    console.error("Error while loading story: ", story);
    return <ErrorMessage />;
  }

  const { key, ...sceneWithoutKey } = scene;

  return <GameScene {...sceneWithoutKey} sceneKey={key} isLastScene={false} />;
};

export const Route = createFileRoute("/game/$gameKey/")({
  component: Component,
});
