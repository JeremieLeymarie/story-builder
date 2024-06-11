import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/game")({
  component: () => <div>Game</div>,
});
