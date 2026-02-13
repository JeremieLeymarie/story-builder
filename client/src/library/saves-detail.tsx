import { PlusIcon, Play, X } from "lucide-react";
import { formatDate, timeFrom } from "@/lib/date";
import { ExtendedProgress } from "./types";
import { cn } from "@/lib/style";
import { GameLink } from "./game-link";
import { useState } from "react";
import { useDeleteProgress } from "./hooks/use-delete-progress";
import { Button } from "@/design-system/primitives/button";
import { ConfirmDialog } from "@/design-system/components";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/design-system/primitives";
// @ts-expect-error until the component is used
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { StoryProgressVisualization } from "./story-progress-visualization";

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
          <h2 className="text-primary text-2xl font-semibold">Your saves:</h2>
          <Button
            onClick={startNewGame}
            size="icon"
            className="rounded-full"
            title="New save"
          >
            <PlusIcon size={24} />
          </Button>
        </div>

        <div className="space-y-4">
          {slicedProgresses.map((progress, index) => (
            <Card
              key={progress.key}
              className={cn(
                "group ring-primary bg-background relative p-4 shadow-md ring-2 transition-all hover:shadow-lg",
                index === 0 && "bg-primary/5",
                progress.finished && "opacity-75",
              )}
            >
              <div className="flex items-center justify-between">
                <GameLink
                  progress={progress}
                  gameKey={progress.storyKey}
                  disabled={progress.finished}
                >
                  <div className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <CardTitle>
                        Save #{index + 1} -{" "}
                        {progress.lastScene?.title || "Unknown scene"}
                      </CardTitle>
                      {progress.finished && (
                        <span className="rounded-full bg-green-500 px-2 py-1 text-xs text-white">
                          COMPLETED
                        </span>
                      )}
                    </div>
                    <CardDescription>
                      {timeFrom(progress.lastPlayedAt)}
                    </CardDescription>
                    <CardContent className="pl-0">
                      <p className="text-muted-foreground/80 text-xs">
                        {formatDate(progress.lastPlayedAt)}
                      </p>
                    </CardContent>
                  </div>
                </GameLink>

                <div className="flex items-center gap-3">
                  {/* Play button */}
                  <GameLink
                    progress={progress}
                    gameKey={progress.storyKey}
                    disabled={progress.finished}
                  >
                    <Button
                      size="icon"
                      disabled={progress.finished}
                      className="rounded-full"
                    >
                      <Play size={18} />
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
            </Card>
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
