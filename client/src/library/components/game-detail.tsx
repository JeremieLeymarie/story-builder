import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { StoryGenreBadge } from "@/design-system/components";
import { formatDurationHHMMSS, timeFrom } from "@/lib/date";
import { Story } from "@/lib/storage/domain";
import { useGetAnalyticsService } from "../hooks/use-get-analytics-service";
import { Analytics } from "./analytics";
import { GameDropdown } from "./game-dropdown";
import { SavesDropdown } from "./saves-dropdown";
import { Save } from "./types";

type Props = {
  story: Story;
  currentProgress: Save;
  otherProgresses: Save[];
};

export const LibraryGameDetail = ({
  story,
  currentProgress,
  otherProgresses,
}: Props) => {
  const navigate = useNavigate();
  const [selectedSaveKey, setSelectedSaveKey] = useState(currentProgress.key);

  const saves = [currentProgress, ...otherProgresses];
  const selectedSave =
    saves.find((s) => s.key === selectedSaveKey) ?? currentProgress;
  const { analyticsService } = useGetAnalyticsService({
    progressKey: selectedSaveKey,
    gameKey: story.key,
  });
  const getProgressRate = analyticsService?.getProgressRate;
  const totalPlayTimeMs = saves.reduce(
    (acc, save) => acc + save.totalPlayTimeMs,
    0,
  );

  const playGame = (save: Save) => {
    navigate({
      to: "/game/$gameKey/$sceneKey",
      params: {
        gameKey: save.storyKey,
        sceneKey: save.currentSceneKey,
      },
      search: { storyProgressKey: save.key },
    });
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-12 flex flex-col gap-8 md:flex-row">
          <div className="shrink-0">
            <img
              src={story.image}
              alt={story.title}
              className="h-78 w-104 rounded-lg object-cover shadow-lg"
            />
          </div>
          <div className="flex-1 space-y-2">
            <GameDropdown gameKey={story.key} />
            <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between md:gap-4">
              <h1 className="text-foreground text-3xl font-bold md:text-4xl">
                {story.title}
              </h1>
              <p className="text-muted-foreground text-sm font-medium whitespace-nowrap tabular-nums md:text-base">
                Total play time: {formatDurationHHMMSS(totalPlayTimeMs)}
              </p>
            </div>
            {story.author && (
              <p className="text-muted-foreground italic">
                Story by&nbsp;
                <span className="font-medium">{story.author.username}</span>
              </p>
            )}
            <p className="text-muted-foreground text-lg leading-relaxed">
              {story.description}
            </p>
            <div className="space-y-4">
              {story.genres && story.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {story.genres.map((genre) => (
                    <StoryGenreBadge key={genre} variant={genre} />
                  ))}
                </div>
              )}

              <SavesDropdown
                saves={saves}
                selectedSave={selectedSave}
                storyKey={story.key}
                getProgressRate={getProgressRate}
                onSelectSave={(save) => setSelectedSaveKey(save.key)}
                onPlay={playGame}
              />
              {(selectedSave.name || selectedSave.lastScene) && (
                <p className="text-sm break-all">
                  {selectedSave.name && (
                    <span className="font-medium">{selectedSave.name}</span>
                  )}
                  {selectedSave.name && selectedSave.lastScene && (
                    <span className="text-muted-foreground"> · </span>
                  )}
                  {selectedSave.lastScene && (
                    <span className="text-muted-foreground">
                      {selectedSave.lastScene.title} ·{" "}
                    </span>
                  )}
                  <span className="text-muted-foreground">
                    {timeFrom(selectedSave.lastPlayedAt)}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
        <Analytics progressKey={selectedSave.key} gameKey={story.key} />
      </div>
    </div>
  );
};
