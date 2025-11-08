import { useMousePosition } from "@/hooks/use-mouse-position";
import { StorylessScene } from "../types";
import { WithoutKey } from "@/types";
import { useBuilderContext } from "./use-builder-context";
import { useReactFlow } from "@xyflow/react";
import { Vec2 } from "@/lib/vec2";

const positionOffset: Vec2 = new Vec2(0);
let lastPosition: Vec2 | null = null;

export const useScenePositioning = () => {
  const { screenToFlowPosition } = useReactFlow();
  const { reactFlowRef } = useBuilderContext();
  const getMousePosition = useMousePosition();

  // Since the nodes could be scattered anywhere
  // we must recenter them around the leftmost position, and then add the desired position
  // Ultimately I think new scenes should centered around the true center instead of the leftmost position, but
  // doing so is QUITE the challenge, you'll either have to
  //  a. Standardise the node measurements or
  //  b. Simulate BuilderFlow in a document fragment and measure the dom there or
  //  c. add the scenes to the builder then measure the nodes using either `useNodesInitialized`, `getNodesBound` or even a `MutationObserver`
  const findLeftMostPositionInBatch = (
    scenes: WithoutKey<StorylessScene>[],
  ): Vec2 => {
    let topX = Infinity;
    let topY = Infinity;
    scenes.forEach((scene) => {
      topX = Math.min(topX, scene.builderParams.position.x);
      topY = Math.min(topY, scene.builderParams.position.y);
    });

    return new Vec2(topX, topY);
  };

  const getOffset = ({
    desiredPosition,
    scenes,
  }: {
    desiredPosition: Vec2;
    scenes: WithoutKey<StorylessScene>[];
  }) => {
    const isLastPlacedScenesTooClose =
      lastPosition && Vec2.distance(desiredPosition, lastPosition) < 40;

    // `positionOffset` represents the offset from the previously created batch of scenes
    // to avoid stacking them up visually
    if (isLastPlacedScenesTooClose) {
      positionOffset.x += 40;
      positionOffset.y += 40;
    } else {
      positionOffset.x = 0;
      positionOffset.y = 0;
      lastPosition = Vec2.from(desiredPosition);
    }

    const offsetFromScenes = findLeftMostPositionInBatch(scenes);
    return lastPosition!.add(positionOffset).subtract(offsetFromScenes);
  };

  const isMouseOverFlow = () => {
    if (!reactFlowRef.current)
      throw new Error("Could not add scene, react flow is missing");
    return reactFlowRef.current.matches(":hover");
  };

  /**
   * Try to get the perfect position for a new scene in the builder
   * @returns the mouse position if the cursor is over the flow and the center of the flow otherwise
   */
  const getNewScenePosition = () => {
    if (isMouseOverFlow()) {
      return screenToFlowPosition(getMousePosition());
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

  return {
    getNewScenePosition,
    getOffset,
  };
};
