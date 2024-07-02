import { createFileRoute } from "@tanstack/react-router";

export const Component = () => {
  const { gameId } = Route.useParams();

  return <div>First scene in game {gameId}</div>;
};

export const Route = createFileRoute("/game/$gameId/")({
  parseParams: ({ gameId }) => {
    return { gameId: parseInt(gameId) };
  },
  component: Component,
});
