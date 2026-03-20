import { Button } from "@/design-system/primitives";
import { Action, StoryProgress, StoryThemeConfig } from "@/lib/storage/domain";
import { cn } from "@/lib/style";
import { Link } from "@tanstack/react-router";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/design-system/primitives/tooltip";
import { PropsWithChildren } from "react";
import { match } from "ts-pattern";
import { getGameService } from "@/domains/game/game-service";

const ActionTooltip = ({
  children,
  isVisible,
  isTestMode,
}: PropsWithChildren<{ isVisible: boolean; isTestMode: boolean }>) => {
  return (
    <Tooltip open={isVisible ? false : undefined}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="max-w-75 text-xs">
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
  actionTheme,
}: {
  text: string;
  isVisible: boolean;
  actionTheme: StoryThemeConfig["action"];
}) => {
  const [className, size] = match(actionTheme.size)
    .with("huge", () => ["py-3 px-4.5", "xl"] as const)
    .with("large", () => ["py-2 px-3.5", "lg"] as const)
    .with("medium", () => ["py-1.5", "default"] as const)
    .with("small", () => ["py-1", "sm"] as const)
    .exhaustive();

  return (
    <Button
      className={cn(
        "h-auto cursor-pointer text-left text-wrap whitespace-normal select-none",
        className,
      )}
      style={{
        backgroundColor: actionTheme.backgroundColor,
        color: actionTheme.textColor,
      }}
      disabled={!isVisible}
      size={size}
    >
      {isVisible ? text : "????"}
    </Button>
  );
};

export const SceneAction = ({
  action,
  progress,
  storyKey,
  actionTheme,
}: {
  action: Action;
  progress: StoryProgress | null;
  storyKey: string;
  actionTheme: StoryThemeConfig["action"];
}) => {
  const gameService = getGameService();
  const isVisible = gameService.getActionVisibility({
    action,
    progress,
  });

  // Only show actions that lead somewhere
  if (action.targets.length === 0) return null;
  const nextScene = gameService.getNextKey(action.targets);
  const isTestMode = !progress;

  if (isTestMode) {
    return (
      <ActionTooltip isTestMode isVisible={isVisible} key={action.text}>
        <Link
          to="/game/test/$gameKey/$sceneKey"
          params={{ gameKey: storyKey, sceneKey: nextScene }}
        >
          <ActionButton
            text={action.text}
            isVisible={isVisible}
            actionTheme={actionTheme}
          />
        </Link>
      </ActionTooltip>
    );
  }

  return (
    <ActionTooltip isTestMode={false} isVisible={isVisible}>
      <Link
        key={action.text}
        to="/game/$gameKey/$sceneKey"
        params={{ gameKey: storyKey, sceneKey: nextScene }}
        search={{ storyProgressKey: progress.key }}
        disabled={!isVisible}
      >
        <ActionButton
          text={action.text}
          isVisible={isVisible}
          actionTheme={actionTheme}
        />
      </Link>
    </ActionTooltip>
  );
};
