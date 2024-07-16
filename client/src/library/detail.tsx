import { Scene, Story, StoryProgress } from "@/lib/storage/dexie/dexie-db";
import { DetailProgress } from "./detail-progress";
import { Button } from "@/design-system/primitives";
import { MoveRightIcon } from "lucide-react";
import { GameLink } from "./game-link";

type Props = {
  story: Story;
  progress: StoryProgress | null;
  currentScene: Scene | null;
};

export const LibraryGameDetail = ({ story, progress, currentScene }: Props) => {
  console.log(story, progress, currentScene);

  return (
    <div
      className="w-full h-full flex justify-evenly items-center max-lg:flex-col max-lg:justify-start"
      style={{
        background: `url('${story.image}')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="space-y-8 p-16 max-lg:space-y-2 max-lg:pb-8">
        <p className="w-max bg-gray-50 bg-opacity-75 p-2 rounded-sm text-3xl font-semibold leading-none tracking-tight max-md:text-xl">
          {story.title}
        </p>
        <p className="text-white text-lg max-md:text-md">{story.description}</p>
      </div>
      {progress && currentScene ? (
        <DetailProgress currentScene={currentScene} progress={progress} />
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <GameLink progress={null} gameId={story.id}>
            <Button className="text-xl animate-bounce max-md:text-lg">
              Start game &nbsp;
              <MoveRightIcon />
            </Button>
          </GameLink>
        </div>
      )}
    </div>
  );
};
