import { PlusIcon, Play, X } from "lucide-react";
import { formatDate, timeFrom } from "@/lib/date";
import { ExtendedProgress } from "./types";
import { cn } from "@/lib/style";
import { GameLink } from "./game-link";
import { useState } from "react";
import { useDeleteProgress } from "./hooks/use-delete-progress";
import { Button } from "@/design-system/primitives/button";
import { ConfirmDialog } from "@/design-system/components";

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
  const { deleteProgress, isDeleting } = useDeleteProgress(
    currentProgress.storyKey,
  );

  const progresses = [currentProgress, ...otherProgresses];
  const slicedProgresses = progresses.slice(0, endProgressIndex);

  const handleDeleteProgress = async (progressKey: string) => {
    await deleteProgress(progressKey);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-primary text-2xl font-bold">Your Saves:</h2>
          <Button
            onClick={startNewGame}
            size="lg"
            className="bg-primary h-12 w-12 rounded-full"
            title="New save"
          >
            <PlusIcon size={24} />
          </Button>
        </div>

        <div className="space-y-4">
          {slicedProgresses.map((progress, index) => (
            <div
              key={progress.key}
              className={cn(
                "group border-primary bg-background relative rounded-2xl border-2 p-4 shadow-md transition-all hover:shadow-lg",
                index === 0 && "border-primary bg-primary/5",
                progress.finished && "opacity-75",
              )}
            >
              <div className="flex items-center justify-between">
                <GameLink progress={progress} gameKey={progress.storyKey}>
                  <div className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <h3 className="text-foreground text-lg font-semibold">
                        Save #{index + 1} -{" "}
                        {progress.lastScene?.title || "Unknown scene"}
                      </h3>
                      {progress.finished && (
                        <span className="rounded-full bg-green-500 px-2 py-1 text-xs text-white">
                          COMPLETED
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {timeFrom(progress.lastPlayedAt)}
                    </p>
                    <p className="text-muted-foreground/80 text-xs">
                      {formatDate(progress.lastPlayedAt)}
                    </p>
                  </div>
                </GameLink>

                <div className="flex items-center gap-3">
                  {/* Play button */}
                  <GameLink progress={progress} gameKey={progress.storyKey}>
                    <Button
                      size="icon"
                      disabled={progress.finished}
                      className="bg-primary hover:bg-primary/90 h-10 w-10 rounded-full shadow-md disabled:opacity-50"
                    >
                      <Play size={18} className="ml-0.5" />
                    </Button>
                  </GameLink>

                  {/* Delete button - outside GameLink */}
                  <ConfirmDialog
                    title="Delete this save?"
                    description="This action cannot be undone. This save will be permanently deleted."
                    confirmLabel="Delete"
                    onConfirm={() => handleDeleteProgress(progress.key)}
                    trigger={
                      <Button
                        disabled={isDeleting}
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8 rounded-full opacity-0 shadow-md transition-all group-hover:opacity-100"
                        title="Delete this save"
                      >
                        <X size={14} />
                      </Button>
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {endProgressIndex < progresses.length && (
          <div className="flex justify-center">
            <Button
              onClick={() =>
                setEndProgressIndex((prev) => prev + PROGRESSES_BY_PAGE)
              }
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
            >
              - Load more -
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
