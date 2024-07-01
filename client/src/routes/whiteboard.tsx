import { DrawingBoard } from "@/whiteboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/whiteboard")({
  component: () => <DrawingBoard />,
});
