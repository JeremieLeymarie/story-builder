import { Button } from "@/design-system/primitives";
import { PlusIcon } from "lucide-react";
import { formatDate, timeFrom } from "@/lib/date";
import { Title } from "@/design-system/components";
import { ExtendedProgress } from "./types";
import { cn } from "@/lib/style";
import { ScrollArea } from "@/design-system/primitives/scroll-area";
import { GameLink } from "./game-link";

export const SavesDetail = ({
  startNewGame,
  currentProgress,
  otherProgresses,
}: {
  startNewGame: () => void;
  currentProgress: ExtendedProgress;
  otherProgresses: ExtendedProgress[];
}) => {
  const progresses = [currentProgress, ...otherProgresses];

  return (
    <div className="mt-12 space-y-6 p-12">
      <div className="space-y-2">
        <Title variant="section">Your progress:</Title>
        <p className="text-sm text-muted-foreground">
          Last played {timeFrom(currentProgress.lastPlayedAt)}
        </p>
        <p className="mb-2 font-semibold text-white">Your saves:</p>
        <ScrollArea className="max-h-[200px]">
          {progresses.map((progress, index) => (
            <GameLink
              key={progress.key}
              progress={progress}
              gameKey={progress.storyKey}
            >
              <div
                className={cn(
                  "group my-3 flex min-w-[300px] cursor-pointer items-center justify-between gap-12 rounded-md border border-primary bg-white bg-opacity-95 px-4 py-3 shadow",
                  index === 0 && "bg-primary",
                  progress.finished && "grayscale",
                )}
              >
                <div>
                  <p
                    className={cn("uppercase", index === 0 && "font-semibold")}
                  >
                    {progress.lastScene?.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(progress.lastPlayedAt)}
                  </p>
                </div>
                {!progress.finished ? (
                  <p className="invisible text-muted-foreground group-hover:visible">
                    Play from here
                  </p>
                ) : (
                  <p>COMPLETED</p>
                )}
              </div>
            </GameLink>
          ))}
        </ScrollArea>

        <Button
          variant="secondary"
          className="gap-2"
          size="sm"
          onClick={startNewGame}
        >
          <PlusIcon /> New game
        </Button>
      </div>
    </div>
  );
};
