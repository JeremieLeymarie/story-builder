import { Scene, StoryProgress } from "@/lib/storage/dexie/dexie-db";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { GameLink } from "./game-link";
import { Button } from "@/design-system/primitives";
import { MoveRightIcon } from "lucide-react";
dayjs.extend(relativeTime);

const getLastPlayedTime = (date: Date) => {
  return dayjs(date).fromNow();
};

const formatDate = (date: Date) => dayjs(date).format("dddd, MMMM D, YYYY");

export const DetailProgress = ({
  progress,
  currentScene,
}: {
  progress: StoryProgress;
  currentScene: Scene;
}) => (
  <div className="space-y-6 flex flex-col items-end max-lg:space-y-2">
    <div className="bg-white bg-opacity-75 p-8 mt-16 space-y-2 rounded-[--radius]">
      <p className="text-lg bg-primary font-bold uppercase w-max px-2 max-md:text-md break-words">
        Your progress:
      </p>
      <p className="text-sm text-muted-foreground">
        Last played {getLastPlayedTime(progress.lastPlayedAt)}
      </p>
      <div>
        <p className="font-semibold mb-2">Last backup:</p>
        <GameLink progress={progress} gameKey={currentScene.storyKey}>
          <div className="border border-primary w-full py-2 px-4 group flex justify-between items-center gap-12">
            <div>
              <p className="uppercase font-semibold">{currentScene?.title}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(progress.lastPlayedAt)}
              </p>
            </div>
            <p className="flex justify-end invisible group-hover:visible text-muted-foreground  hover:text-white">
              Resume
            </p>
          </div>
        </GameLink>
      </div>
      <GameLink progress={progress} gameKey={currentScene.storyKey}></GameLink>
    </div>
    <div>
      <GameLink progress={progress} gameKey={currentScene.storyKey}>
        <Button className="text-xl max-md:text-lg">
          Start at last backup &nbsp;
          <MoveRightIcon />
        </Button>
      </GameLink>
    </div>
  </div>
);
