import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { GameLink } from "./game-link";
import { Button } from "@/design-system/primitives";
import { MoveRightIcon } from "lucide-react";
import { formatDate } from "@/lib/date";
import { Title } from "@/design-system/components";
import { StoryProgress, Scene } from "@/lib/storage/domain";
dayjs.extend(relativeTime);

const getLastPlayedTime = (date: Date) => {
  return dayjs(date).fromNow();
};

export const DetailProgress = ({
  progress,
  currentScene,
}: {
  progress: StoryProgress;
  currentScene: Scene;
}) => (
  <div className="flex flex-col items-end space-y-6 max-lg:space-y-2">
    <div className="mt-16 space-y-2 rounded-[--radius] bg-white bg-opacity-75 p-8">
      <Title variant="section">Your progress:</Title>
      <p className="text-sm text-muted-foreground">
        Last played {getLastPlayedTime(progress.lastPlayedAt)}
      </p>
      <div>
        <p className="mb-2 font-semibold">Last backup:</p>
        <GameLink progress={progress} gameKey={currentScene.storyKey}>
          <div className="group flex w-full items-center justify-between gap-12 border border-primary px-4 py-2">
            <div>
              <p className="font-semibold uppercase">{currentScene?.title}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(progress.lastPlayedAt)}
              </p>
            </div>
            <p className="invisible flex justify-end text-muted-foreground hover:text-white group-hover:visible">
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
