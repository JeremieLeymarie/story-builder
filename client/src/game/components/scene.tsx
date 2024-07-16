import { Scene } from "@/lib/storage/dexie/dexie-db";
import { SceneAction } from "./scene-action";
import { Button } from "@/design-system/primitives";
import { SaveIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/design-system/primitives/tooltip";

type GameSceneProps = Omit<Scene, "key"> & {
  sceneKey: string;
  saveProgress: () => void;
};

export const GameScene = ({
  title,
  actions,
  content,
  storyKey,
  saveProgress,
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
      <div className="w-full px-6 py-8">
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
    </div>
  );
};
