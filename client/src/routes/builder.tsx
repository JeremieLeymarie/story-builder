import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/builder")({
  component: () => <div>Builder</div>,
});
