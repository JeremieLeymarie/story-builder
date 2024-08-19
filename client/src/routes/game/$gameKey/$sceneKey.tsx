import { ErrorMessage, BackdropLoader } from "@/design-system/components";
import { GameScene } from "@/game/components/scene";
import { useUpdateStoryProgress } from "@/game/hooks/use-update-story-progress";
import { useInitialQuery } from "@/hooks/use-query";
import { getGameService } from "@/services";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";

export const Component = () => {
  const { sceneKey, gameKey } = Route.useParams();
  const gameService = getGameService();
  const scene = useLiveQuery(
    () => gameService.getSceneData(sceneKey),
    [sceneKey, gameKey],
  );

  const storyProgress = useInitialQuery(() =>
    gameService.getStoryProgress(gameKey),
  );

  useUpdateStoryProgress({ scene, storyProgress });

  if (scene === undefined || storyProgress === undefined) {
    return <BackdropLoader />;
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
      isLastScene={!sceneWithoutKey.actions.length}
    />
  );
};

export const Route = createFileRoute("/game/$gameKey/$sceneKey")({
  component: Component,
});
