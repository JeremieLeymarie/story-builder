import { Button } from "@/design-system/primitives";
import { Action, StoryProgress, StoryThemeConfig } from "@/lib/storage/domain";
import { cn } from "@/lib/style";
import { Link } from "@tanstack/react-router";
import { useActionVisibility } from "../hooks/use-action-visibility";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/design-system/primitives/tooltip";
import { PropsWithChildren } from "react";
import { match } from "ts-pattern";

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
  actionTheme,
}: {
  text: string;
  isVisible: boolean;
  actionTheme: StoryThemeConfig["action"];
}) => (
  <Button
    className={cn(
      "cursor-pointer text-left text-wrap whitespace-normal select-none",
    )}
    style={{
      backgroundColor: actionTheme.backgroundColor,
      color: actionTheme.textColor,
    }}
    disabled={!isVisible}
    size={match(actionTheme.size)
      .with("huge", () => "xl" as const)
      .with("large", () => "lg" as const)
      .with("medium", () => "default" as const)
      .with("small", () => "sm" as const)
      .exhaustive()}
  >
    {isVisible ? text : "????"}
  </Button>
);

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
  const isVisible = useActionVisibility({ action, progress });

  if (!action.sceneKey) {
    // Only show actions that lead somewhere
    return null;
  }
  const isTestMode = !progress;

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
    <ActionTooltip isTestMode={isTestMode} isVisible={isVisible}>
      <Link
        key={action.text}
        to="/game/$gameKey/$sceneKey"
        params={{ gameKey: storyKey, sceneKey: action.sceneKey }}
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
