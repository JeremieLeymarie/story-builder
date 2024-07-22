import { ErrorMessage, Loader } from "@/design-system/components";
import { GameScene } from "@/game/components/scene";
import { useRemoteStoryProgress } from "@/hooks/use-remote-story-progress";
import { Story, StoryProgress } from "@/lib/storage/dexie/dexie-db";
import { getLocalRepository } from "@/lib/storage/dexie/indexed-db-repository";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useEffect, useState } from "react";

export const Component = () => {
  const { gameKey } = Route.useParams();
  const repo = getLocalRepository();
  // TODO: only one live query would be better?
  const story = useLiveQuery(() => repo.getStory(gameKey));
  const scene = useLiveQuery(
    () =>
      story?.firstSceneKey ? repo.getScene(story.firstSceneKey) : undefined,
    [story],
  );
  const [storyProgress, setStoryProgress] = useState<StoryProgress | null>();

  const { saveProgress } = useRemoteStoryProgress();

  const createStoryProgress = useCallback(
    async (story: Story) => {
      const progress = await repo.getStoryProgress(gameKey);
      if (progress) return progress;

      if (!story.firstSceneKey) {
        throw new Error(
          `Error: story should have a first scene. Story: ${story.key}`,
        );
      }

      const payload = {
        history: [story.firstSceneKey],
        currentSceneKey: story.firstSceneKey,
        lastPlayedAt: new Date(),
      };

      await repo.createStoryProgress({
        storyKey: story.key,
        ...payload,
      });
    },
    [gameKey, repo],
  );

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
    return <Loader />;
  }
  if (story === null || scene === null || storyProgress === null) {
    console.error("Error while loading story: ", story);
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

export const Route = createFileRoute("/game/$gameKey/")({
  component: Component,
});
