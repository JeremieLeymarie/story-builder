import { Button } from "@/design-system/primitives";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { formatDate, timeFrom } from "@/lib/date";
import { Title } from "@/design-system/components";
import { ExtendedProgress } from "./types";
import { cn } from "@/lib/style";
import { GameLink } from "./game-link";
import { useMemo, useState } from "react";
import { useDeleteProgress } from "./hooks/use-delete-progress";

export const SavesDetail = ({
  startNewGame,
  currentProgress,
  otherProgresses,
  onRefresh,
}: {
  startNewGame: () => void;
  currentProgress: ExtendedProgress;
  otherProgresses: ExtendedProgress[];
  onRefresh?: () => void;
}) => {
  const PROGRESSES_BY_PAGE = 3;
  const [endProgressIndex, setEndProgressIndex] = useState(PROGRESSES_BY_PAGE);
  const { deleteProgress, isDeleting } = useDeleteProgress();

  const progresses = [currentProgress, ...otherProgresses];

  const slicedProgresses = progresses.slice(0, endProgressIndex);

  const handleDeleteProgress = async (
    event: React.MouseEvent,
    progressKey: string,
  ) => {
    event.preventDefault(); // Prevent the navigation
    event.stopPropagation();

    const result = await deleteProgress(progressKey);
    if (result.success && onRefresh) {
      onRefresh();
    }
  };

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
                  "group border-primary my-3 flex min-w-[300px] cursor-pointer items-center justify-between gap-12 rounded-md border bg-white/95 px-4 py-3 shadow",
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
                  <p className="text-muted-foreground text-xs">
                    {formatDate(progress.lastPlayedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!progress.finished ? (
                    <p className="text-muted-foreground invisible group-hover:visible">
                      Play from here
                    </p>
                  ) : (
                    <p>COMPLETED</p>
                  )}
                  <button
                    onClick={(e) => handleDeleteProgress(e, progress.key)}
                    disabled={isDeleting}
                    className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50"
                    title="Delete this save"
                  >
                    <Trash2Icon size={16} />
                  </button>
                </div>
              </div>
            </GameLink>
          ))}
        </div>
        {endProgressIndex < progresses.length && (
          <div className="flex justify-center">
            <p
              className="text-muted-foreground cursor-pointer text-sm hover:text-black"
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
