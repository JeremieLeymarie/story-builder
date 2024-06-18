import { createFileRoute } from "@tanstack/react-router";
import { Draw } from "@/components/whiteboard";

export const Route = createFileRoute("/whiteboard")({
  component: () => <Draw />,
});
