import { Builder } from "@/components/builder/builder";
import { BuilderHome } from "@/components/builder/builder-home";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/builder/stories")({
  component: () => <BuilderHome />,
});
