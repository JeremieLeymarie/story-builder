import { SavesDetail } from "./saves-detail";
import { Story } from "@/lib/storage/domain";
import { ExtendedProgress } from "./types";
import { useRouter } from "@tanstack/react-router";
import { getLibraryService } from "@/domains/game/library-service";
import { Play, Share2, Trash2 } from "lucide-react";
import { cn } from "@/lib/style";
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

  const startNewGame = () => {
    getLibraryService()
      .createBlankStoryProgress({ storyKey: story.key })
      .then((progress) =>
        navigate({
          to: "/game/$gameKey/$sceneKey",
          params: { gameKey: story.key, sceneKey: story.firstSceneKey },
          search: { storyProgressKey: progress.key },
        }),
      );
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

  // Calcul du pourcentage de progression
  const progressPercentage = Math.round(
    (currentProgress.history.length / (story.scenes?.length || 1)) * 100
  ) || 0;

  // Validation de l'URL de l'image - exclure les URLs Google de recherche
  const isValidImageUrl = (url: string | undefined): boolean => {
    if (!url) return false;
    // Exclure les URLs de redirection Google
    if (url.includes('google.com/url') || url.includes('google.com/search')) return false;
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Section principale - Image à gauche, infos à droite */}
        <div className="flex gap-8 mb-12">
          
          {/* Image à gauche */}
          <div className="flex-shrink-0">
            {isValidImageUrl(story.image) ? (
              <img 
                src={story.image} 
                alt={story.title}
                style={{ width: 'calc(var(--spacing) * 104)', height: 'calc(var(--spacing) * 78)' }}
                className="object-cover rounded-lg shadow-lg"
              />
            ) : (
              <div 
                style={{ width: 'calc(var(--spacing) * 104)', height: 'calc(var(--spacing) * 78)' }}
                className="border-4 border-dashed border-gray-300 rounded-lg bg-gray-100 flex items-center justify-center"
              >
                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                  <div className="w-12 h-12 bg-gray-400 rounded-full"></div>
                </div>
              </div>
            )}
          </div>

          {/* Infos à droite */}
          <div className="flex-1 space-y-4">
            {/* Titre */}
            <h1 className="text-4xl font-bold text-gray-800">{story.title}</h1>
            
            {/* Description */}
            <p className="text-gray-600 text-lg leading-relaxed">
              {story.description || "Un arbre au centre du monde vous attend. Découvrez une histoire mystérieuse où la nature et la magie se rencontrent dans une aventure inoubliable."}
            </p>

            {/* Tags de genre */}
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

            {/* Boutons Jouer et Partager */}
            <div className="flex gap-4">
              <button
                onClick={playCurrentGame}
                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
              >
                <Play size={20} />
                Jouer
              </button>
              <button
                onClick={shareGame}
                className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Share2 size={20} />
                Partager
              </button>
            </div>

            {/* Barre de progression */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Progression de l'histoire</span>
                <span className="text-2xl font-bold text-gray-800">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Auteur et bouton supprimer */}
            <div className="flex justify-between items-center pt-4">
              {story.author && (
                <p className="text-gray-500 italic">
                  Story by <span className="font-medium">{story.author.username}</span>
                </p>
              )}
              <button
                onClick={deleteGame}
                className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium transition-colors"
              >
                <Trash2 size={16} />
                Supprimer le jeu
              </button>
            </div>
          </div>
        </div>

        {/* Section Your Saves en dessous */}
        <div>
          <SavesDetail
            startNewGame={startNewGame}
            currentProgress={currentProgress}
            otherProgresses={otherProgresses}
          />
        </div>
      </div>
    </div>
  );
};
