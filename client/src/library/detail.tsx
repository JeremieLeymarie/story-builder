import { SavesDetail } from "./saves-detail";
import { Button } from "@/design-system/primitives";
import { SwordIcon } from "lucide-react";
import { GameLink } from "./game-link";
import { StoryGenreBadge, Title } from "@/design-system/components";
import { formatDate } from "@/lib/date";
import { Story } from "@/lib/storage/domain";
import { ExtendedProgress } from "./types";
import { useCallback } from "react";
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
    <div
      className="flex h-full w-full flex-col items-center justify-start lg:flex-row lg:justify-center"
      style={{
        background: `url('${story.image}')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex h-full w-6/12 items-center justify-center border-primary">
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
          {story.status === "published" && !!story.publicationDate && (
            <p className="max-md:text-md text-lg text-white">
              Published on&nbsp;
              {formatDate(story.publicationDate)}
            </p>
          )}
          <p className="max-md:text-md text-lg text-white">
            {story.description}
          </p>
          <div className="flex w-full justify-center">
            <GameLink
              progress={currentProgress}
              gameKey={currentProgress.storyKey}
            >
              <Button className="gap-2 text-xl max-md:text-lg">
                <SwordIcon />
                Play
              </Button>
            </GameLink>
          </div>
        </div>
      </div>
      <div className="h-full w-6/12 bg-black bg-opacity-65">
        <SavesDetail
          startNewGame={startNewGame}
          currentProgress={currentProgress}
          otherProgresses={otherProgresses}
        />
      </div>
    </div>
  );
};
