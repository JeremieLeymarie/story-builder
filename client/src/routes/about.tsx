import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: () => (
    <div>
      Hello /about!
      <h1>Local first</h1>
    </div>
  ),
});
