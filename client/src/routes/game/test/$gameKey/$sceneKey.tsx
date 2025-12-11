import { ErrorMessage, BackdropLoader } from "@/design-system/components";
import { GameScene } from "@/game/components/game-scene";
import { useGetGameSceneData } from "@/game/hooks/use-get-game-scene-data";
import { createFileRoute } from "@tanstack/react-router";

export const Component = () => {
  const { sceneKey, gameKey } = Route.useParams();
  const { scene, theme, isLoading } = useGetGameSceneData({
    storyKey: gameKey,
    sceneKey,
  });

  if (isLoading || scene === undefined || theme === undefined) {
    return <BackdropLoader />;
  }

  if (scene === null || theme === null) {
    console.error(`Error while loading scene: ${sceneKey}`);
    return <ErrorMessage />;
  }

  return (
    <GameScene
      scene={scene}
      isLastScene={!scene.actions.length}
      mode="test"
      theme={theme}
    />
  );
};

export const Route = createFileRoute("/game/test/$gameKey/$sceneKey")({
  component: Component,
});
