import { Vec2 } from "../position";
import { StorylessScene } from "../types";
import { WithoutKey } from "@/types";

const positionOffset: Vec2 = Vec2.ZERO;
let lastPosition: Vec2 | null = null;

export const useSmartOffset = () => {
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
    // Since the nodes could be scattered anywhere
    // we must recenter them around the leftmost position, and then add the desired position
    // Ultimately I think new scenes should centered around the true center instead of the leftmost position, but
    // doing so is QUITE the challenge, you'll either have to
    //  a. Standardise the node measurements or
    //  b. Simulate BuilderFlow in a document fragment and measure the dom there or
    //  c. add the scenes to the builder then measure the nodes using either `useNodesInitialized`, `getNodesBound` or even a `MutationObserver`
    const offsetFromScenes = desiredPosition.sub(
      findLeftMostPositionInBatch(scenes),
    );

    const isLastPlacedScenesTooClose =
      lastPosition && Vec2.dist(desiredPosition, lastPosition) < 40;

    // `positionOffset` represents the offset from the previously created batch of scenes
    // to avoid stacking them up visually
    if (isLastPlacedScenesTooClose) {
      positionOffset.x += 40;
      positionOffset.y += 40;
      return offsetFromScenes.add(positionOffset);
    }

    positionOffset.x = 0;
    positionOffset.y = 0;
    lastPosition = structuredClone(desiredPosition);
    return offsetFromScenes;
  };
  return getOffset;
};
