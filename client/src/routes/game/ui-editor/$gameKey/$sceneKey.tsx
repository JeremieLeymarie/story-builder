import { ErrorMessage, BackdropLoader } from "@/design-system/components";
import { getGameService } from "@/domains/game/game-service";
import { GameScene } from "@/game/components/scene";
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
      mode="ui-editor"
    />
  );
};

export const Route = createFileRoute("/game/ui-editor/$gameKey/$sceneKey")({
  component: Component,
});
