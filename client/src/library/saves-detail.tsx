import { GameLink } from "./game-link";
import { Button } from "@/design-system/primitives";
import { PlusIcon, SwordIcon } from "lucide-react";
import { formatDate, timeFrom } from "@/lib/date";
import { Title } from "@/design-system/components";
import { DetailCompleted } from "./detail-completed";
import { ExtendedProgress } from "./types";
import { useState } from "react";
import { cn } from "@/lib/style";
import { ScrollArea } from "@/design-system/primitives/scroll-area";

export const SavesDetail = ({
  currentProgress,
  otherProgresses,
}: {
  currentProgress: ExtendedProgress;
  otherProgresses: ExtendedProgress[];
}) => {
  const [selectedProgressIndex] = useState(0);
  const progresses = [currentProgress, ...otherProgresses];

  if (currentProgress.finished) {
    return <DetailCompleted progress={currentProgress} />;
  }
  return (
    <div className="mt-12 flex flex-row items-center gap-12 space-y-6 lg:flex-col lg:items-end lg:gap-0">
      <div className="space-y-2 rounded-[--radius] bg-white bg-opacity-75 p-8">
        <Title variant="section">Your progress:</Title>
        <p className="text-sm text-muted-foreground">
          Last played {timeFrom(currentProgress.lastPlayedAt)}
        </p>
        <div>
          <p className="mb-2 font-semibold">Your backup slots:</p>
          <ScrollArea className="max-h-[200px]">
            {progresses.map((progress, index) => (
              <div
                key={progress.key}
                className={cn(
                  "my-3 flex w-full cursor-pointer items-center justify-between gap-12 rounded-md border border-primary bg-white bg-opacity-50 px-4 py-2 shadow",
                  selectedProgressIndex === index && "bg-primary",
                )}
              >
                <div>
                  <p
                    className={cn(
                      "uppercase",
                      selectedProgressIndex === index && "font-semibold",
                    )}
                  >
                    {progress.lastScene?.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(progress.lastPlayedAt)}
                  </p>
                </div>
              </div>
            ))}
          </ScrollArea>

          <GameLink progress={null} gameKey={currentProgress.storyKey}>
            <Button variant="secondary" className="gap-2" size="sm">
              <PlusIcon /> New game
            </Button>
          </GameLink>
        </div>
      </div>
      <div>
        <GameLink progress={currentProgress} gameKey={currentProgress.storyKey}>
          <Button className="gap-2 text-xl max-md:text-lg">
            <SwordIcon />
            Play
          </Button>
        </GameLink>
      </div>
    </div>
  );
};
