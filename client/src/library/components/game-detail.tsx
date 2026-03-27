import { SavesDetail } from "./saves-detail";
import { Story } from "@/lib/storage/domain";
import { Save } from "./types";
import { useNavigate } from "@tanstack/react-router";
import { PlayIcon } from "lucide-react";
import { StoryGenreBadge } from "@/design-system/components";
import { Button } from "@/design-system/primitives/button";
import { useState } from "react";
import { GameDropdown } from "./game-dropdown";
import { timeFrom } from "@/lib/date";
import { Analytics } from "./analytics";

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
  const [selectedSave, setSelectedSave] = useState(currentProgress);

  const saves = [currentProgress, ...otherProgresses];

  const playGame = () => {
    navigate({
      to: "/game/$gameKey/$sceneKey",
      params: {
        gameKey: selectedSave.storyKey,
        sceneKey: selectedSave.currentSceneKey,
      },
      search: { storyProgressKey: selectedSave.key },
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
            <h1 className="text-foreground text-3xl font-bold md:text-4xl">
              {story.title}
            </h1>
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

              <div className="flex items-center gap-2">
                <Button
                  onClick={playGame}
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <PlayIcon />
                  Play
                </Button>
                <span className="text-muted-foreground">or</span>
                <SavesDetail
                  selectedSave={selectedSave}
                  saves={saves}
                  onSelectSave={setSelectedSave}
                />
              </div>
              {!!selectedSave.lastScene && (
                <p className="text-sm">
                  <span>{selectedSave.lastScene?.title}</span>&nbsp;
                  <span className="text-muted-foreground">
                    - Last played {timeFrom(selectedSave.lastPlayedAt)}
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
