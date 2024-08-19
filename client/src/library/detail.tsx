import { DetailProgress } from "./detail-progress";
import { Button } from "@/design-system/primitives";
import { MoveRightIcon } from "lucide-react";
import { GameLink } from "./game-link";
import { StoryGenreBadge, Title } from "@/design-system/components";
import { formatDate } from "@/lib/date";
import { Story, StoryProgress, Scene } from "@/lib/storage/domain";

type Props = {
  story: Story;
  progress: StoryProgress | null;
  currentScene: Scene | null;
};

export const LibraryGameDetail = ({ story, progress, currentScene }: Props) => {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-start px-32 pt-32 lg:flex-row lg:justify-center lg:gap-28 lg:pt-0"
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
              <StoryGenreBadge variant={genre} />
            ))}
          </div>
        )}
        {!!story.author && (
          <p className="font-bold uppercase text-primary">
            Story by: {story.author?.username}
          </p>
        )}
        {!!story.publicationDate && (
          <p className="max-md:text-md text-lg text-white">
            Published on
            {formatDate(story.publicationDate)}
          </p>
        )}
        <p className="max-md:text-md text-lg text-white">{story.description}</p>
      </div>
      {progress && currentScene ? (
        <DetailProgress currentScene={currentScene} progress={progress} />
      ) : (
        <div className="mt-8 flex items-center justify-center">
          <GameLink progress={null} gameKey={story.key}>
            <Button className="text-xl shadow-3xl shadow-primary max-md:text-lg">
              Start game &nbsp;
              <MoveRightIcon />
            </Button>
          </GameLink>
        </div>
      )}
    </div>
  );
};
