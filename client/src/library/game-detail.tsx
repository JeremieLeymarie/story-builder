import { SavesDetail } from "./saves-detail";
import { Story } from "@/lib/storage/domain";
import { ExtendedProgress } from "./types";
import { useRouter } from "@tanstack/react-router";
import { getLibraryService } from "@/domains/game/library-service";
import { InfoIcon, Play, Trash2 } from "lucide-react";
import { StoryGenreBadge } from "@/design-system/components";
import { Button } from "@/design-system/primitives/button";
import { Progress } from "@/design-system/primitives/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/design-system/primitives/tooltip";
import { StoryProgressVisualization } from "./story-progress-visualization";

type Props = {
  story: Story;
  currentProgress: ExtendedProgress;
  otherProgresses: ExtendedProgress[];
  totalScenes: number;
};

export const LibraryGameDetail = ({
  story,
  currentProgress,
  otherProgresses,
  totalScenes,
}: Props) => {
  const { navigate } = useRouter();

  const deleteGame = async () => {
    await getLibraryService().deleteGame(story.key);
    navigate({ to: "/library" });
  };

  const createNewSave = async () => {
    await getLibraryService().createBlankStoryProgress({ storyKey: story.key });
  };

  const playCurrentGame = () => {
    navigate({
      to: "/game/$gameKey/$sceneKey",
      params: {
        gameKey: currentProgress.storyKey,
        sceneKey: currentProgress.currentSceneKey,
      },
      search: { storyProgressKey: currentProgress.key },
    });
  };

  // Progress percentage calculation using real number of scenes
  const progressPercentage =
    totalScenes > 0
      ? Math.min(
          Math.round((currentProgress.history.length / totalScenes) * 100),
          100,
        )
      : 0;

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
          <div className="flex-1 space-y-4">
            <h1 className="text-foreground text-4xl font-bold">
              {story.title}
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {story.description}
            </p>
            {story.genres && story.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {story.genres.map((genre) => (
                  <StoryGenreBadge key={genre} variant={genre} />
                ))}
              </div>
            )}
            <div className="flex gap-4">
              <Button
                onClick={playCurrentGame}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Play size={20} />
                Play
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-medium">
                    Story progress
                  </span>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon size={16} className="text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Proportion of pages visited out of all pages in the story
                    </TooltipContent>
                  </Tooltip>
                </div>
                <span className="text-foreground text-2xl font-bold">
                  {progressPercentage}%
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>
            <div className="flex items-center justify-between pt-4">
              {story.author && (
                <p className="text-muted-foreground italic">
                  Story by{" "}
                  <span className="font-medium">{story.author.username}</span>
                </p>
              )}
              <Button
                onClick={deleteGame}
                variant="ghost"
                className="text-destructive hover:text-destructive/80"
              >
                <Trash2 size={16} />
                Delete game
              </Button>
            </div>
          </div>
        </div>

        <div>
          <SavesDetail
            startNewGame={createNewSave}
            currentProgress={currentProgress}
            otherProgresses={otherProgresses}
          />
        </div>
      </div>
    </div>
  );
};
