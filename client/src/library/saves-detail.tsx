import { Button } from "@/design-system/primitives";
import { PlusIcon } from "lucide-react";
import { formatDate, timeFrom } from "@/lib/date";
import { Title } from "@/design-system/components";
import { ExtendedProgress } from "./types";
import { cn } from "@/lib/style";
import { GameLink } from "./game-link";
import { useMemo, useState } from "react";

export const SavesDetail = ({
  startNewGame,
  currentProgress,
  otherProgresses,
}: {
  startNewGame: () => void;
  currentProgress: ExtendedProgress;
  otherProgresses: ExtendedProgress[];
}) => {
  const PROGRESSES_BY_PAGE = 3;
  const [endProgressIndex, setEndProgressIndex] = useState(PROGRESSES_BY_PAGE);

  const progresses = useMemo(
    () => [currentProgress, ...otherProgresses],
    [currentProgress, otherProgresses],
  );

  const slicedProgresses = useMemo(
    () => progresses.slice(0, endProgressIndex),
    [endProgressIndex, progresses],
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Title variant="section">Your saves:</Title>
        <div className="h-full">
          {slicedProgresses.map((progress, index) => (
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
                  <div className="flex items-center gap-2">
                    <p
                      className={cn(
                        "uppercase",
                        index === 0 && "font-semibold",
                      )}
                    >
                      {progress.lastScene?.title}
                    </p>
                    <p className="text-xs">{timeFrom(progress.lastPlayedAt)}</p>
                  </div>
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
        </div>
        {endProgressIndex < progresses.length && (
          <div className="flex justify-center">
            <p
              className="cursor-pointer text-sm text-muted-foreground hover:text-black"
              onClick={() =>
                setEndProgressIndex((prev) => prev + PROGRESSES_BY_PAGE)
              }
            >
              - Load more -
            </p>
          </div>
        )}

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
