import { ErrorMessage, BackdropLoader } from "@/design-system/components";
import { GameScene } from "@/game/components/scene";
import { useUpdateStoryProgress } from "@/game/hooks/use-update-story-progress";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { z } from "zod";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { getGameService } from "@/domains/game/game-service";

export const Component = () => {
  const { sceneKey, gameKey } = Route.useParams();
  const { storyProgressKey } = Route.useSearch();
  const gameService = getGameService();
  const scene = useLiveQuery(
    () => gameService.getSceneData(sceneKey),
    [sceneKey, gameKey],
  );

  const { data: storyProgress } = useQuery({
    queryFn: () => gameService.getStoryProgress(storyProgressKey),
    queryKey: ["story-progress", storyProgressKey],
  });

  useUpdateStoryProgress({ scene, storyProgress });

  if (scene === undefined || storyProgress === undefined) {
    return <BackdropLoader />;
  }

  if (scene === null || storyProgress === null) {
    console.error("Error while loading scene: ", scene);
    return <ErrorMessage />;
  }

  return (
    <GameScene
      scene={scene}
      isLastScene={!scene.actions.length}
      progress={storyProgress}
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
