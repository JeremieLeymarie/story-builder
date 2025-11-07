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
        sceneKey: currentProgress.currentSceneKey 
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
    100
  );

  // Image URL validation - exclude Google search redirect URLs
  const isValidImageUrl = (url: string | undefined): boolean => {
    if (!url) return false;
    // Exclude Google redirect URLs
    if (url.includes('google.com/url') || url.includes('google.com/search')) return false;
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-8 mb-12">
          <div className="flex-shrink-0">
            {isValidImageUrl(story.image) ? (
              <img 
                src={story.image} 
                alt={story.title}
                style={{ width: 'calc(var(--spacing) * 104)', height: 'calc(var(--spacing) * 78)' }}
                className="object-cover rounded-lg shadow-lg"/>
            ) : (
              <div 
                style={{ width: 'calc(var(--spacing) * 104)', height: 'calc(var(--spacing) * 78)' }}
                className="border-4 border-dashed border-gray-300 rounded-lg bg-gray-100 flex items-center justify-center">
                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                  <div className="w-12 h-12 bg-gray-400 rounded-full"></div>
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 space-y-4">
            <h1 className="text-4xl font-bold text-gray-800">{story.title}</h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              {story.description || "Un arbre au centre du monde vous attend. Découvrez une histoire mystérieuse où la nature et la magie se rencontrent dans une aventure inoubliable."}
            </p>
            <div className="flex flex-wrap gap-2">
              {story.genres?.map((genre) => (
                <StoryGenreBadge key={genre} variant={genre} />
              )) || (
                <>
                  <span className="px-3 py-1 bg-gray-800 text-white text-sm rounded-full">Science-Fiction</span>
                  <span className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-full">Détective</span>
                  <span className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-full">Horreur</span>
                  <span className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-full">Suspense</span>
                  <span className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-full">Fantasy</span>
                </>
              )}
            </div>
            <div className="flex gap-4">
              <button
                onClick={playCurrentGame}
                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg">
                <Play size={20} />
                Jouer
              </button>
              <button
                onClick={shareGame}
                className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
                <Share2 size={20} />
                Partager
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Progression de l'histoire</span>
                <span className="text-2xl font-bold text-gray-800">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}>
                  </div>
              </div>
            </div>
            <div className="flex justify-between items-center pt-4">
              {story.author && (
                <p className="text-gray-500 italic">
                  Story by <span className="font-medium">{story.author.username}</span>
                </p>
              )}
              <button
                onClick={deleteGame}
                className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium transition-colors">
                <Trash2 size={16} />
                Supprimer le jeu
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
