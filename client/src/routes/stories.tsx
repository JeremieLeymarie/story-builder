import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/stories")({
  component: () => <div>Hello /stories!</div>,
});
