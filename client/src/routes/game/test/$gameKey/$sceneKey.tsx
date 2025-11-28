import { ErrorMessage, BackdropLoader } from "@/design-system/components";
import { DEFAULT_STORY_THEME } from "@/domains/builder/story-theme";
import { getGameService } from "@/domains/game/game-service";
import { GameScene } from "@/game/components/game-scene";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";

export const Component = () => {
  const { sceneKey, gameKey } = Route.useParams();
  const gameService = getGameService();
  const scene = useLiveQuery(
    () => gameService.getSceneData(sceneKey),
    [sceneKey, gameKey],
  );

  if (scene === undefined) {
    return <BackdropLoader />;
  }

  if (scene === null) {
    console.error("Error while loading scene: ", scene);
    return <ErrorMessage />;
  }

  return (
    <GameScene
      scene={scene}
      isLastScene={!scene.actions.length}
      mode="test"
      theme={DEFAULT_STORY_THEME} // TODO: pass real theme
    />
  );
};

export const Route = createFileRoute("/game/test/$gameKey/$sceneKey")({
  component: Component,
});
