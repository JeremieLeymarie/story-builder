import { SavesDetail } from "./saves-detail";
import { Button } from "@/design-system/primitives";
import { SwordIcon } from "lucide-react";
import { GameLink } from "./game-link";
import { StoryGenreBadge, Title } from "@/design-system/components";
import { formatDate } from "@/lib/date";
import { Story } from "@/lib/storage/domain";
import { ExtendedProgress } from "./types";
import { useCallback, useMemo } from "react";
import { getLibraryService } from "@/services";
import { useRouter } from "@tanstack/react-router";

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

  const areAllSavesFinished = useMemo(
    () =>
      [currentProgress, ...otherProgresses].every(
        (progress) => progress.finished,
      ),
    [currentProgress, otherProgresses],
  );

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

  // TODO: avoid duplicating bg
  return (
    <div className="flex h-full w-full flex-col items-center justify-start">
      <div
        className="flex h-full min-h-[500px] w-full items-center justify-center border-b-4 border-primary px-12 pt-16"
        style={{
          background: `url('${story.image}')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="space-y-4 max-lg:space-y-2 max-lg:pb-8 lg:max-w-[50%]">
          <Title>{story.title}</Title>
          {story.genres.length && (
            <div className="flex flex-wrap gap-2">
              {story.genres.map((genre) => (
                <StoryGenreBadge key={genre} variant={genre} />
              ))}
            </div>
          )}
          {!!story.author && (
            <p className="font-bold uppercase text-primary">
              Story by: {story.author?.username}
            </p>
          )}
          {story.type === "published" && !!story.publicationDate && (
            <p className="max-md:text-md text-lg text-white">
              Published on&nbsp;
              {formatDate(story.publicationDate)}
            </p>
          )}
          <p className="max-md:text-md text-lg text-white">
            {story.description}
          </p>
          <div className="flex w-full justify-center">
            {areAllSavesFinished ? (
              <Button
                className="gap-2 text-xl max-md:text-lg"
                onClick={startNewGame}
              >
                <SwordIcon />
                Start a new game
              </Button>
            ) : (
              <GameLink
                progress={currentProgress}
                gameKey={currentProgress.storyKey}
              >
                <Button className="gap-2 text-xl max-md:text-lg">
                  <SwordIcon />
                  Play
                </Button>
              </GameLink>
            )}
          </div>
        </div>
      </div>
      <div className="flex h-full w-full justify-center bg-white bg-opacity-75 lg:w-6/12">
        <div className="w-8/12 max-w-[600px] lg:w-full">
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
