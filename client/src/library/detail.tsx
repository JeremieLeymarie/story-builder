import { Button } from "@/design-system/primitives";
import { Story, StoryProgress } from "@/lib/storage/dexie/dexie-db";
import { Link } from "@tanstack/react-router";
import { PropsWithChildren } from "react";

const GameLink = ({
  progress,
  gameId,
  children,
}: PropsWithChildren<{ progress: StoryProgress | null; gameId: number }>) => {
  if (!progress) {
    return (
      <Link to="/game/$gameId" params={{ gameId }}>
        {children}
      </Link>
    );
  }

  return (
    <Link
      to="/game/$gameId/$sceneId"
      params={{ gameId, sceneId: progress.currentSceneId }}
    >
      {children}
    </Link>
  );
};

type Props = {
  story: Story;
  progress: StoryProgress | null;
};

export const LibraryGameDetail = ({ story, progress }: Props) => {
  return (
    <div
      className="w-full h-full p-16 flex"
      style={{
        background: `url('${story.image}')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* TODO: Add last played info */}
      <div className="space-y-8 w-8/12">
        <p className="w-max bg-gray-50 bg-opacity-75 p-2 rounded-sm text-3xl font-semibold leading-none tracking-tight max-md:text-xl">
          {story.title}
        </p>
        <p className="text-white text-lg max-md:text-md">{story.description}</p>
      </div>
      {/* <hr className="w-8" /> */}
      <div className="w-4/12 h-full">
        <GameLink progress={progress} gameId={story.id}>
          <Button>Play</Button>
        </GameLink>
      </div>
    </div>
  );
};
