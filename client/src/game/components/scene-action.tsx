import { Button } from "@/design-system/primitives";
import { Action, StoryProgress, StoryThemeConfig } from "@/lib/storage/domain";
import { cn } from "@/lib/style";
import { useNavigate } from "@tanstack/react-router";
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
      <TooltipTrigger asChild>
        <div>{children}</div>
      </TooltipTrigger>
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
  onClick,
}: {
  text: string;
  isVisible: boolean;
  actionTheme: StoryThemeConfig["action"];
  onClick: () => void;
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
        "h-max w-fit cursor-pointer text-left text-pretty wrap-anywhere whitespace-normal select-none",
        className,
      )}
      style={{
        backgroundColor: actionTheme.backgroundColor,
        color: actionTheme.textColor,
      }}
      disabled={!isVisible}
      size={size}
      onClick={onClick}
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
  const navigate = useNavigate();

  // Only show actions that lead somewhere
  if (action.targets.length === 0) return null;
  const nextScene = gameService.getNextKey(action.targets);
  const isTestMode = !progress;

  if (isTestMode) {
    return (
      <ActionTooltip isTestMode isVisible={isVisible} key={action.text}>
        <ActionButton
          key={action.key}
          text={action.text}
          isVisible={isVisible}
          actionTheme={actionTheme}
          onClick={() =>
            navigate({
              to: "/game/test/$gameKey/$sceneKey",
              params: { gameKey: storyKey, sceneKey: nextScene },
              replace: true,
            })
          }
        />
      </ActionTooltip>
    );
  }

  return (
    <ActionTooltip isTestMode={false} isVisible={isVisible}>
      <ActionButton
        key={action.key}
        text={action.text}
        isVisible={isVisible}
        actionTheme={actionTheme}
        onClick={() =>
          navigate({
            to: "/game/$gameKey/$sceneKey",
            params: { gameKey: storyKey, sceneKey: nextScene },
            search: { storyProgressKey: progress.key },
            replace: true,
          })
        }
      />
    </ActionTooltip>
  );
};
