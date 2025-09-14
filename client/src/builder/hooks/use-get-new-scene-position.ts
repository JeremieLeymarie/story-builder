import { useMousePosition } from "@/hooks/use-mouse-position";
import { useBuilderContext } from "./use-builder-context";
import { useReactFlow } from "@xyflow/react";

/**
 * Try to get the perfect position for a new scene in the builder
 * @returns a function that returns the mouse position if the cursor is over the flow and the center of the flow otherwise
 */
export const useGetNewScenePosition = () => {
  const { screenToFlowPosition } = useReactFlow();
  const { reactFlowRef } = useBuilderContext();
  const mousePosition = useMousePosition();

  const isMouseOverFlow = () => {
    if (!reactFlowRef.current)
      throw new Error("Could not add scene, react flow is missing");
    return reactFlowRef.current.matches(":hover");
  };

  const getNewScenePosition = () => {
    if (isMouseOverFlow()) {
      return screenToFlowPosition(mousePosition);
    } else {
      const rect = reactFlowRef.current!.getBoundingClientRect();
      // find the center
      const position = {
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2,
      };
      return screenToFlowPosition(position);
    }
  };

  return { getNewScenePosition };
};
