import { PlusIcon, Play, X } from "lucide-react";
import { formatDate, timeFrom } from "@/lib/date";
import { ExtendedProgress } from "./types";
import { cn } from "@/lib/style";
import { GameLink } from "./game-link";
import { useState } from "react";
import { useDeleteProgress } from "./hooks/use-delete-progress";

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
  const { deleteProgress, isDeleting } = useDeleteProgress();

  const progresses = [currentProgress, ...otherProgresses];
  const slicedProgresses = progresses.slice(0, endProgressIndex);

  const handleDeleteProgress = async (progressKey: string) => {
    await deleteProgress(progressKey);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-yellow-600">Your Saves:</h2>
          <button
            onClick={startNewGame}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 shadow-lg transition-all hover:bg-yellow-500"
            title="New save"
          >
            <PlusIcon size={24} className="text-white" />
          </button>
        </div>

        <div className="space-y-4">
          {slicedProgresses.map((progress, index) => (
            <div
              key={progress.key}
              className={cn(
                "group relative rounded-2xl border-2 border-yellow-400 bg-white p-4 shadow-md transition-all hover:shadow-lg",
                index === 0 && "border-yellow-500 bg-yellow-50",
                progress.finished && "opacity-75",
              )}
            >
              <GameLink progress={progress} gameKey={progress.storyKey}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Save #{index + 1} -{" "}
                      {progress.lastScene?.title || "Unknown scene"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {timeFrom(progress.lastPlayedAt)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(progress.lastPlayedAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Play button */}
                    <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-yellow-400 shadow-md transition-all hover:bg-yellow-500">
                      <Play size={18} className="ml-0.5 text-white" />
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteProgress(progress.key);
                      }}
                      disabled={isDeleting}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 opacity-0 shadow-md transition-all group-hover:opacity-100 hover:bg-red-600"
                      title="Delete this save"
                    >
                      <X size={14} className="text-white" />
                    </button>
                  </div>
                </div>
              </GameLink>

              {progress.finished && (
                <div className="absolute top-2 right-2">
                  <span className="rounded-full bg-green-500 px-2 py-1 text-xs text-white">
                    COMPLETED
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {endProgressIndex < progresses.length && (
          <div className="flex justify-center">
            <button
              onClick={() =>
                setEndProgressIndex((prev) => prev + PROGRESSES_BY_PAGE)
              }
              className="px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-800"
            >
              - Load more -
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
