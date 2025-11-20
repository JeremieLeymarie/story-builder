import { Button } from "@/design-system/primitives";
import { Action, StoryProgress } from "@/lib/storage/domain";
import { cn } from "@/lib/style";
import { Link } from "@tanstack/react-router";
import { useActionVisibility } from "../hooks/use-action-visibility";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/design-system/primitives/tooltip";
import { PropsWithChildren } from "react";

const ActionTooltip = ({
  children,
  isVisible,
  isTestMode,
}: PropsWithChildren<{ isVisible: boolean; isTestMode: boolean }>) => {
  return (
    <Tooltip open={isVisible ? false : undefined}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="max-w-[300px] text-xs">
        You did not unlock this choice...
        {isTestMode && (
          <p className="mt-0.5 italic">
            In test mode, you can select a choice even if it's disabled.
          </p>
        )}
      </TooltipContent>
    </Tooltip>
  );
};

const ActionButton = ({
  text,
  isVisible,
}: {
  text: string;
  isVisible: boolean;
}) => (
  <Button
    className={cn(
      "h-max cursor-pointer text-left text-wrap whitespace-normal select-none",
    )}
    disabled={!isVisible}
  >
    {isVisible ? text : "????"}
  </Button>
);

export const SceneAction = ({
  action,
  progress,
  storyKey,
}: {
  action: Action;
  progress: StoryProgress | null;
  storyKey: string;
}) => {
  const isVisible = useActionVisibility({ action, progress });

  if (!action.sceneKey) {
    // Only show actions that lead somewhere
    return null;
  }
  const isTestMode = !progress;

  console.log({ progress });

  if (isTestMode) {
    return (
      <ActionTooltip
        isTestMode={isTestMode}
        isVisible={isVisible}
        key={action.text}
      >
        <Link
          to="/game/test/$gameKey/$sceneKey"
          params={{ gameKey: storyKey, sceneKey: action.sceneKey }}
        >
          <ActionButton text={action.text} isVisible={isVisible} />
        </Link>
      </ActionTooltip>
    );
  }

  return (
    <ActionTooltip isTestMode={isTestMode} isVisible={isVisible}>
      <Link
        key={action.text}
        to="/game/$gameKey/$sceneKey"
        params={{ gameKey: storyKey, sceneKey: action.sceneKey }}
        search={{ storyProgressKey: progress.key }}
        disabled={!isVisible}
      >
        <ActionButton text={action.text} isVisible={isVisible} />
      </Link>
    </ActionTooltip>
  );
};
