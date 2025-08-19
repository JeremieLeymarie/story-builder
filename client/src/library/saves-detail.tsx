import { Button } from "@/design-system/primitives";
import { PlusIcon, Trash2Icon, Play, X } from "lucide-react";
import { formatDate, timeFrom } from "@/lib/date";
import { Title } from "@/design-system/components";
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
        <h2 className="text-2xl font-bold text-yellow-600">Your Saves:</h2>
        
        {/* Bouton + pour nouvelle save */}
        <div className="flex justify-end">
          <button
            onClick={startNewGame}
            className="w-12 h-12 bg-yellow-400 hover:bg-yellow-500 rounded-full flex items-center justify-center shadow-lg transition-all"
            title="Nouvelle sauvegarde"
          >
            <PlusIcon size={24} className="text-white" />
          </button>
        </div>

        <div className="space-y-4">
          {slicedProgresses.map((progress, index) => (
            <div
              key={progress.key}
              className={cn(
                "relative group bg-white rounded-2xl border-2 border-yellow-400 p-4 shadow-md hover:shadow-lg transition-all",
                index === 0 && "bg-yellow-50 border-yellow-500",
                progress.finished && "opacity-75",
              )}
            >
              <GameLink
                progress={progress}
                gameKey={progress.storyKey}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800">
                      Save #{index + 1} - {progress.lastScene?.title || "Scène inconnue"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {timeFrom(progress.lastPlayedAt)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(progress.lastPlayedAt)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Bouton Play */}
                    <div className="w-10 h-10 bg-yellow-400 hover:bg-yellow-500 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer">
                      <Play size={18} className="text-white ml-0.5" />
                    </div>
                    
                    {/* Bouton Delete */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteProgress(progress.key);
                      }}
                      disabled={isDeleting}
                      className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
                      title="Supprimer cette sauvegarde"
                    >
                      <X size={14} className="text-white" />
                    </button>
                  </div>
                </div>
              </GameLink>
              
              {progress.finished && (
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
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
              className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
            >
              - Load more -
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
