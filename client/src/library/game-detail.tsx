import { SavesDetail } from "./saves-detail";
import { Story } from "@/lib/storage/domain";
import { ExtendedProgress } from "./types";
import { GameBanner } from "./game-banner";
import { GameInfo } from "./game-info";
import { useRouter } from "@tanstack/react-router";
import { DeleteGameButton } from "./delete-game-button";
import { getLibraryService } from "@/domains/game/library-service";
import { useState } from "react";

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
  const [_refreshKey, setRefreshKey] = useState(0);

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

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-start">
      <GameBanner story={story} />
      <div className="flex w-full flex-col gap-12 px-12 pt-12 md:flex-row">
        <div className="md:w-6/12">
          <GameInfo
            story={story}
            currentProgress={currentProgress}
            otherProgresses={otherProgresses}
            startNewGame={startNewGame}
          />
          <DeleteGameButton deleteGame={deleteGame} />
        </div>
        <div className="md:w-6/12">
          <SavesDetail
            startNewGame={startNewGame}
            currentProgress={currentProgress}
            otherProgresses={otherProgresses}
            onRefresh={handleRefresh}
          />
        </div>
      </div>
    </div>
  );
};
