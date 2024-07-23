import { SceneAction } from "./scene-action";
import { Button } from "@/design-system/primitives";
import {
  BookUpIcon,
  LibraryBigIcon,
  LibraryIcon,
  SaveIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/design-system/primitives/tooltip";
import { Scene } from "@/lib/storage/domain";
import { Divider } from "@/design-system/components/divider";
import { Link } from "@tanstack/react-router";

type GameSceneProps = Omit<Scene, "key"> & {
  sceneKey: string;
  saveProgress: () => void;
  isLastScene: boolean;
};

export const GameScene = ({
  title,
  actions,
  content,
  storyKey,
  saveProgress,
  isLastScene,
}: GameSceneProps) => {
  return (
    <div className="p-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button variant="outline" onClick={saveProgress}>
              <SaveIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save your progress in the cloud</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="flex w-full justify-center px-6 py-8">
        <div>
          <h1 className="scroll-m-20 text-3xl font-bold tracking-tight lg:text-4xl">
            {title}
          </h1>
          <p className="leading-7 [&:not(:first-child)]:mt-6">{content}</p>
          <div className="mt-4 flex w-full flex-wrap gap-3">
            {actions.map((action) => (
              <SceneAction key={action.text} {...action} storyKey={storyKey} />
            ))}
          </div>
        </div>
      </div>
      {isLastScene && (
        <div className="mt-6 flex flex-col items-center gap-4">
          <Divider className="w-[200px]" />
          <p className="w-6/12 text-center italic text-muted-foreground">
            This was the last scene of this story... Yes, we know, endings are
            always difficult. That's why there is an (almost) infinite number of
            stories waiting to be played in the
            <span className="font-semibold"> free</span> store!
          </p>
          <div className="flex gap-2">
            <Link to="/library">
              <Button>
                <LibraryBigIcon size="18px" />
                &nbsp;Library
              </Button>
            </Link>
            <Link to="/store">
              <Button>
                <BookUpIcon size="18px" />
                &nbsp; Store
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
