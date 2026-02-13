import { Action, Scene } from "@/lib/storage/domain";
import { _GenericBuilderError } from "./hooks/use-builder-error-store";

export type InvalidActionTargetPercentagesError = _GenericBuilderError<
  "invalid-action-target-percentages",
  {
    sceneName?: string;
    sourceSceneKey: string;
    targetSceneKeys: string[];
    actionText: string;
    probabilityTotal: number;
  }
>;

export const makeInvalidTargetPercentageError = ({
  scene,
  action,
}: {
  scene: Scene;
  action: Action;
}) => {
  const error = {
    type: "invalid-action-target-percentages",
    id: action.key,
    payload: {
      sourceSceneKey: scene.key,
      sceneName: scene.title,
      actionText: action.text,
      probabilityTotal: action.targets.reduce(
        (acc, target) => acc + target.probability,
        0,
      ),
      targetSceneKeys: action.targets.map(({ sceneKey }) => sceneKey),
    },
  } satisfies InvalidActionTargetPercentagesError;
  return error;
};
