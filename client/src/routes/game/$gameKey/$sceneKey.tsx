import { ErrorMessage, Loader } from "@/design-system/components";
import { GameScene } from "@/game/components/scene";
import { useGameScene } from "@/hooks/use-game-scene";
import { createFileRoute } from "@tanstack/react-router";

export const Component = () => {
  const { sceneKey, gameKey } = Route.useParams();
  const { scene, storyProgress, saveProgress } = useGameScene({
    sceneKey,
    gameKey,
  });

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
      isLastScene={!!storyProgress.finished}
      saveProgress={() => saveProgress(storyProgress)}
    />
  );
};

export const Route = createFileRoute("/game/$gameKey/$sceneKey")({
  component: Component,
});
