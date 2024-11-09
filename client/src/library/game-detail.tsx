import { SavesDetail } from "./saves-detail";
import { Story } from "@/lib/storage/domain";
import { ExtendedProgress } from "./types";
import { GameBanner } from "./game-banner";
import { GameInfo } from "./game-info";
import { getLibraryService } from "@/services";
import { useRouter } from "@tanstack/react-router";
import { useCallback } from "react";
import { DeleteGameButton } from "./delete-game-button";

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

  const deleteGame = useCallback(async () => {
    await getLibraryService().deleteGame(story.key);
    navigate({ to: "/library" });
  }, [navigate, story.key]);

  const startNewGame = useCallback(() => {
    getLibraryService()
      .createBlankStoryProgress({ story })
      .then((progress) =>
        navigate({
          to: "/game/$gameKey/$sceneKey",
          params: { gameKey: story.key, sceneKey: story.firstSceneKey },
          search: { storyProgressKey: progress.key },
        }),
      );
  }, [navigate, story]);

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
          />
        </div>
      </div>
    </div>
  );
};
