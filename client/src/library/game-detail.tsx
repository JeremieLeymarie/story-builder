import { SavesDetail } from "./saves-detail";
import { Story } from "@/lib/storage/domain";
import { ExtendedProgress } from "./types";
import { useRouter } from "@tanstack/react-router";
import { getLibraryService } from "@/domains/game/library-service";
import { Play, Trash2 } from "lucide-react";
import { StoryGenreBadge } from "@/design-system/components";
import { Button } from "@/design-system/primitives/button";

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
        <div className="mb-12 flex gap-8">
          {story.image && (
            <div className="flex-shrink-0">
              <img
                src={story.image}
                alt={story.title}
                style={{
                  width: "calc(var(--spacing) * 104)",
                  height: "calc(var(--spacing) * 78)",
                }}
                className="rounded-lg object-cover shadow-lg"
              />
            </div>
          )}
          <div className="flex-1 space-y-4">
            <h1 className="text-foreground text-4xl font-bold">
              {story.title}
            </h1>
            {story.description && (
              <p className="text-muted-foreground text-lg leading-relaxed">
                {story.description}
              </p>
            )}
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
                <span className="text-muted-foreground font-medium">
                  Story Progress
                </span>
                <span className="text-foreground text-2xl font-bold">
                  {progressPercentage}%
                </span>
              </div>
              <div className="bg-secondary h-3 w-full rounded-full">
                <div
                  className="bg-primary h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
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
