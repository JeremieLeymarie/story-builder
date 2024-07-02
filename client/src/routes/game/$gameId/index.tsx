import { ErrorMessage, Loader } from "@/design-system/components";
import { GameScene } from "@/game/scene";
import { Scene } from "@/lib/storage/dexie/dexie-db";
import { getLocalRepository } from "@/lib/storage/dexie/indexed-db-repository";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";

export const Component = () => {
  const { gameId } = Route.useParams();
  const story = useLiveQuery(() => getLocalRepository().getStory(gameId));
  const [scene, setScene] = useState<Scene | null>();

  useEffect(() => {
    if (story === null || !story?.firstSceneId) {
      return;
    }

    getLocalRepository()
      .getScene(story.firstSceneId)
      .then((scene) => setScene(scene))
      .catch(() => setScene(null));
  }, [story]);

  if (story === undefined || scene === undefined) {
    return <Loader />;
  }
  if (story === null || scene === null) {
    console.error("Error while loading story: ", story);
    return <ErrorMessage />;
  }

  return <GameScene {...scene} />;
};

export const Route = createFileRoute("/game/$gameId/")({
  parseParams: ({ gameId }) => {
    return { gameId: parseInt(gameId) };
  },
  component: Component,
});
