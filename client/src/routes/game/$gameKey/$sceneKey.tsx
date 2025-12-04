import { ErrorMessage, BackdropLoader } from "@/design-system/components";
import { GameScene } from "@/game/components/game-scene";
import { useUpdateStoryProgress } from "@/game/hooks/use-update-story-progress";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { getGameService } from "@/domains/game/game-service";
import { useGetGameSceneData } from "@/game/hooks/use-get-game-scene-data";

export const Component = () => {
  const { sceneKey, gameKey } = Route.useParams();
  const { storyProgressKey } = Route.useSearch();
  const gameService = getGameService();
  const { scene, theme, isLoading } = useGetGameSceneData({
    storyKey: gameKey,
    sceneKey,
  });

  const { data: storyProgress } = useQuery({
    queryFn: () => gameService.getStoryProgress(storyProgressKey),
    queryKey: ["story-progress", storyProgressKey],
  });

  useUpdateStoryProgress({ scene, storyProgress });

  if (
    isLoading ||
    scene === undefined ||
    storyProgress === undefined ||
    theme === undefined
  ) {
    return <BackdropLoader />;
  }

  if (scene === null || storyProgress === null || theme === null) {
    console.error("Error while loading scene: ", scene);
    return <ErrorMessage />;
  }

  return (
    <GameScene
      scene={scene}
      isLastScene={!scene.actions.length}
      progress={storyProgress}
      theme={theme}
      mode="game"
    />
  );
};

const searchParams = z.object({
  storyProgressKey: z.string(),
});

export const Route = createFileRoute("/game/$gameKey/$sceneKey")({
  validateSearch: zodSearchValidator({ schema: searchParams }),
  component: Component,
});
