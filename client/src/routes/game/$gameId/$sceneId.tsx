import { ErrorMessage } from "@/design-system/components";
import { GameScene } from "@/game/components/scene";
import { getLocalRepository } from "@/lib/storage/dexie/indexed-db-repository";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { Loader } from "lucide-react";

export const Component = () => {
  const { sceneId, gameId } = Route.useParams();
  const scene = useLiveQuery(
    () => getLocalRepository().getScene(sceneId),
    [sceneId, gameId],
  );

  if (scene === undefined || scene === undefined) {
    return <Loader />;
  }

  if (scene === null) {
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
