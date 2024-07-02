import { createFileRoute } from "@tanstack/react-router";

export const Component = () => {
  const { gameId, sceneId } = Route.useParams();

  return (
    <div>
      Game scene {sceneId} in game {gameId}
    </div>
  );
};

export const Route = createFileRoute("/game/$gameId/$sceneId")({
  parseParams: ({ gameId, sceneId }) => {
    return { gameId: parseInt(gameId), sceneId: parseInt(sceneId) };
  },
  component: Component,
});
