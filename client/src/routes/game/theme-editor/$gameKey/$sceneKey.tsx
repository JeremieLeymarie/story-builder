import { ErrorMessage, BackdropLoader } from "@/design-system/components";
import { GameWithThemeEditor } from "@/game/components/theme-editor/theme-editor";
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

  return <GameWithThemeEditor theme={theme} scene={scene} storyKey={gameKey} />;
};

export const Route = createFileRoute("/game/theme-editor/$gameKey/$sceneKey")({
  component: Component,
});
