import { ErrorMessage, BackdropLoader } from "@/design-system/components";
import { GameScene } from "@/game/components/scene";
import { useUpdateStoryProgress } from "@/game/hooks/use-update-story-progress";
import { getGameService } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";

export const Component = () => {
  const { sceneKey, gameKey } = Route.useParams();
  const gameService = getGameService();
  const scene = useLiveQuery(
    () => gameService.getSceneData(sceneKey),
    [sceneKey, gameKey],
  );

  const { data: storyProgress } = useQuery({
    queryFn: () => gameService.getStoryProgress(gameKey),
    queryKey: ["story-progress"],
  });

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
