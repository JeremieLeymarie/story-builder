import { Action, StoryProgress } from "@/lib/storage/domain";
import { match } from "ts-pattern";

export const useActionVisibility = ({
  action,
  progress,
}: {
  action: Action;
  progress: StoryProgress | null;
}) => {
  if (action.type === "simple") return true;
  if (!progress) return false;

  return match(action.condition)
    .with({ type: "user-did-visit" }, (condition) =>
      progress.history.includes(condition.sceneKey),
    )
    .with(
      { type: "user-did-not-visit" },
      (condition) => !progress.history.includes(condition.sceneKey),
    )
    .with({ type: "character-attribute" }, () => {
      // TODO: handle this (https://github.com/JeremieLeymarie/story-builder/issues/458)
      return true;
    })
    .exhaustive();
};
