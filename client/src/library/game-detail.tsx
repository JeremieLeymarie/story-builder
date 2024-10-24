import { GameLink } from "./game-link";
import { Button } from "@/design-system/primitives";
import { MoveRightIcon } from "lucide-react";
import { formatDate, timeFrom } from "@/lib/date";
import { Title } from "@/design-system/components";
import { DetailCompleted } from "./detail-completed";
import { ExtendedProgress } from "./types";
import { useState } from "react";

export const GameDetail = ({
  currentProgress,
  otherProgresses,
}: {
  currentProgress: ExtendedProgress;
  otherProgresses: ExtendedProgress[];
}) => {
  const [selectedProgressIndex, setSelectedProgressIndex] = useState(0);
  const progresses = [currentProgress, ...otherProgresses];

  if (currentProgress.finished) {
    return <DetailCompleted progress={currentProgress} />;
  }
  return (
    <div className="flex flex-col items-end space-y-6 max-lg:space-y-2">
      <div className="mt-16 space-y-2 rounded-[--radius] bg-white bg-opacity-75 p-8">
        <Title variant="section">Your progress:</Title>
        <p className="text-sm text-muted-foreground">
          Last played {timeFrom(currentProgress.lastPlayedAt)}
        </p>
        <div>
          <p className="mb-2 font-semibold">Your backup slots:</p>
          {progresses.map((progress) => (
            <div>
              <div className="group flex w-full items-center justify-between gap-12 border border-primary px-4 py-2">
                <div>
                  <p className="font-semibold uppercase">
                    {progress.lastScene?.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(progress.lastPlayedAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <GameLink progress={currentProgress} gameKey={currentProgress.storyKey}>
          <Button className="text-xl max-md:text-lg">
            Start at last backup &nbsp;
            <MoveRightIcon />
          </Button>
        </GameLink>
      </div>
    </div>
  );
};
