import { BuilderHome } from "@/components/builder/builder-home";
import { createFileRoute } from "@tanstack/react-router";

const Component = () => {
  return <BuilderHome />;
};

export const Route = createFileRoute("/builder/stories")({
  component: Component,
});
