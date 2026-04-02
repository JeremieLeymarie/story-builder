import { ErrorMessage, BackdropLoader } from "@/design-system/components";
import { GameScene } from "@/game/components/game-scene";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { getGameService } from "@/domains/game/game-service";
import { useGetGameSceneData } from "@/game/hooks/use-get-game-scene-data";
import { Scene } from "@/lib/storage/domain";

// TODO: test life cycle
const useGetUpdatedStoryProgress = ({ scene }: { scene?: Scene | null }) => {
  const { storyProgressKey } = Route.useSearch();
  const gameService = getGameService();

  const {
    data: result,
    isLoading,
    isFetching,
    isPlaceholderData,
  } = useQuery({
    queryFn: async () => {
      try {
        return await gameService.saveProgress(storyProgressKey, scene!);
      } catch (err) {
        console.error(err);
        return null;
      }
    },
    queryKey: ["story-progress", storyProgressKey, scene],
    enabled: !!scene,
    staleTime: Infinity,
  });

  return { result, isLoading: isLoading || (isFetching && isPlaceholderData) };
};

const Component = () => {
  const { sceneKey, gameKey } = Route.useParams();
  const { scene, theme, isLoading } = useGetGameSceneData({
    storyKey: gameKey,
    sceneKey,
  });

  const { result: progressResult, isLoading: isProgressLoading } =
    useGetUpdatedStoryProgress({
      scene,
    });

  if (
    isLoading ||
    isProgressLoading ||
    scene === undefined ||
    progressResult === undefined ||
    theme === undefined
  ) {
    return <BackdropLoader />;
  }

  if (
    scene === null ||
    progressResult === null ||
    progressResult.updatedProgress === null ||
    theme === null
  ) {
    console.error("Error while loading scene: ", scene);
    return <ErrorMessage />;
  }

  return (
    <GameScene
      scene={scene}
      isLastScene={!scene.actions.length}
      progress={progressResult.updatedProgress}
      theme={theme}
      mode="game"
      triggeredSideEffects={progressResult.effectsTriggered}
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
