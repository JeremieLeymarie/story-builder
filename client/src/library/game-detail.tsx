import { SavesDetail } from "./saves-detail";
import { Story } from "@/lib/storage/domain";
import { ExtendedProgress } from "./types";
import { useRouter } from "@tanstack/react-router";
import { getLibraryService } from "@/domains/game/library-service";
import { Play, Share2, Trash2 } from "lucide-react";
import { StoryGenreBadge } from "@/design-system/components";

type Props = {
  story: Story;
  currentProgress: ExtendedProgress;
  otherProgresses: ExtendedProgress[];
};

export const LibraryGameDetail = ({
  story,
  currentProgress,
  otherProgresses,
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

  const shareGame = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  // Progress percentage calculation based on history
  // Estimation: a typical story has around 10-20 scenes (TODO: find a better solution)
  const estimatedTotalScenes = 15;
  const progressPercentage = Math.min(
    Math.round((currentProgress.history.length / estimatedTotalScenes) * 100),
    100,
  );

  // Image URL validation - exclude Google search redirect URLs
  const isValidImageUrl = (url: string | undefined): boolean => {
    if (!url) return false;
    // Exclude Google redirect URLs
    if (url.includes("google.com/url") || url.includes("google.com/search"))
      return false;
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-12 flex gap-8">
          <div className="flex-shrink-0">
            {isValidImageUrl(story.image) ? (
              <img
                src={story.image}
                alt={story.title}
                style={{
                  width: "calc(var(--spacing) * 104)",
                  height: "calc(var(--spacing) * 78)",
                }}
                className="rounded-lg object-cover shadow-lg"
              />
            ) : (
              <div
                style={{
                  width: "calc(var(--spacing) * 104)",
                  height: "calc(var(--spacing) * 78)",
                }}
                className="flex items-center justify-center rounded-lg border-4 border-dashed border-gray-300 bg-gray-100"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-300">
                  <div className="h-12 w-12 rounded-full bg-gray-400"></div>
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 space-y-4">
            <h1 className="text-4xl font-bold text-gray-800">{story.title}</h1>
            {story.description && (
              <p className="text-lg leading-relaxed text-gray-600">
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
              <button
                onClick={playCurrentGame}
                className="flex items-center gap-2 rounded-lg bg-yellow-400 px-6 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-yellow-500"
              >
                <Play size={20} />
                Play
              </button>
              <button
                onClick={shareGame}
                className="flex items-center gap-2 rounded-lg bg-gray-200 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-300"
              >
                <Share2 size={20} />
                Share
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-600">
                  Story Progress
                </span>
                <span className="text-2xl font-bold text-gray-800">
                  {progressPercentage}%
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-gray-200">
                <div
                  className="h-3 rounded-full bg-yellow-400 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4">
              {story.author && (
                <p className="text-gray-500 italic">
                  Story by{" "}
                  <span className="font-medium">{story.author.username}</span>
                </p>
              )}
              <button
                onClick={deleteGame}
                className="flex items-center gap-2 font-medium text-red-500 transition-colors hover:text-red-600"
              >
                <Trash2 size={16} />
                Delete game
              </button>
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
