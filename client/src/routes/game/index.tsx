import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/game/")({
  component: () => <div>Mes parties</div>,
});
