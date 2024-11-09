import { Separator } from "@/design-system/primitives/separator";
import { Story } from "@/lib/storage/domain";
import { GameLink } from "./game-link";
import { Button } from "@/design-system/primitives";
import { SwordIcon } from "lucide-react";
import { useMemo } from "react";
import { ExtendedProgress } from "./types";

export const GameInfo = ({
  story,
  currentProgress,
  otherProgresses,
  startNewGame,
}: {
  story: Story;
  currentProgress: ExtendedProgress;
  otherProgresses: ExtendedProgress[];
  startNewGame: () => void;
}) => {
  const areAllSavesFinished = useMemo(
    () =>
      [currentProgress, ...otherProgresses].every(
        (progress) => progress.finished,
      ),
    [currentProgress, otherProgresses],
  );

  return (
    <div className="w-full">
      {!!story.author && (
        <p className="text-primary">
          Story by <span className="italic">{story.author?.username}</span>
        </p>
      )}
      <p className="max-md:text-md md:text-lg">{story.description}</p>

      <div className="my-2">
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
      <Separator className="my-4" />
    </div>
  );
};
