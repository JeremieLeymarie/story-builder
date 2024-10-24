import { Button } from "@/design-system/primitives";
import { PlusIcon } from "lucide-react";
import { formatDate, timeFrom } from "@/lib/date";
import { Title } from "@/design-system/components";
import { DetailCompleted } from "./detail-completed";
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

  if (currentProgress.finished) {
    return <DetailCompleted progress={currentProgress} />;
  }
  return (
    <div className="mt-12 space-y-6 p-12">
      <div className="space-y-2">
        <Title variant="section">Your progress:</Title>
        <p className="text-sm text-muted-foreground">
          Last played {timeFrom(currentProgress.lastPlayedAt)}
        </p>
        <p className="mb-2 font-semibold">Your backup slots:</p>
        <ScrollArea className="max-h-[200px]">
          {progresses.map((progress, index) => (
            <GameLink
              key={progress.key}
              progress={progress}
              gameKey={progress.storyKey}
            >
              <div
                className={cn(
                  "group my-3 flex min-w-[300px] cursor-pointer items-center justify-between gap-12 rounded-md border border-primary bg-white bg-opacity-75 px-4 py-3 shadow",
                  0 === index && "bg-primary",
                )}
              >
                <div>
                  <p
                    className={cn("uppercase", 0 === index && "font-semibold")}
                  >
                    {progress.lastScene?.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(progress.lastPlayedAt)}
                  </p>
                </div>
                <div className="invisible text-muted-foreground group-hover:visible">
                  Play from here
                </div>
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
