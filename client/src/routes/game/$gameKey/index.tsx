import { ErrorMessage, BackdropLoader } from "@/design-system/components";
import { GameScene } from "@/game/components/scene";
import { StoryProgress } from "@/lib/storage/domain";
import { getGameService } from "@/services";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";

export const Component = () => {
  const { gameKey } = Route.useParams();
  const { createStoryProgress, getFirstSceneData } = getGameService();

  const { story, scene } = useLiveQuery(() => getFirstSceneData(gameKey)) ?? {};
  const [storyProgress, setStoryProgress] = useState<StoryProgress | null>();

  useEffect(() => {
    if (story)
      createStoryProgress(story).then((progress) =>
        setStoryProgress(progress ?? null),
      );
  }, [createStoryProgress, story]);

  if (
    story === undefined ||
    scene === undefined ||
    storyProgress === undefined
  ) {
    return <BackdropLoader />;
  }
  if (story === null || scene === null || storyProgress === null) {
    console.error("Error while loading story: ", story);
    return <ErrorMessage />;
  }

  return (
    <GameScene scene={scene} isLastScene={false} progress={storyProgress} />
  );
};

export const Route = createFileRoute("/game/$gameKey/")({
  component: Component,
});
