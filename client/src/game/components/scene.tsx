import { SceneAction } from "./scene-action";
import { Button } from "@/design-system/primitives";
import { LibraryBigIcon } from "lucide-react";

import { Scene, StoryProgress } from "@/lib/storage/domain";
import { Divider } from "@/design-system/components/divider";
import { Link } from "@tanstack/react-router";

type GameSceneProps = {
  scene: Scene;
  isLastScene: boolean;
  progress: StoryProgress | null;
};

export const GameScene = ({
  progress,
  scene: { title, actions, content, storyKey },
  isLastScene,
}: GameSceneProps) => {
  return (
    <div className="flex w-full justify-center py-16">
      <div className="w-8/12">
        <div className="w-full px-6 py-8">
          <div>
            <h1 className="scroll-m-20 text-3xl font-bold tracking-tight lg:text-4xl">
              {title}
            </h1>
            <p className="leading-7 [&:not(:first-child)]:mt-6">{content}</p>
            <div className="mt-4 flex w-full flex-wrap gap-3">
              {actions.map((action) => (
                <SceneAction
                  key={action.text}
                  action={action}
                  storyKey={storyKey}
                  progressKey={progress?.key ?? null}
                />
              ))}
            </div>
          </div>
        </div>
        {isLastScene && (
          <div className="mt-6 flex flex-col items-center gap-4">
            <Divider className="w-[200px]" />
            <p className="w-6/12 text-center italic text-muted-foreground">
              This was the last scene of this story... Yes, we know, endings are
              always difficult. But you can still go back to your library and
              find more stories to play!
            </p>
            <div className="flex gap-2">
              <Link to="/library">
                <Button>
                  <LibraryBigIcon size="18px" />
                  &nbsp;Library
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
