import { Scene } from "@/lib/storage/dexie/dexie-db";
import { SceneAction } from "./scene-action";

type GameSceneProps = Scene;

export const GameScene = ({
  title,
  actions,
  content,
  storyId,
}: GameSceneProps) => {
  return (
    <div className="py-8 px-6 w-full">
      <h1 className="scroll-m-20 text-3xl font-bold tracking-tight lg:text-4xl">
        {title}
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6">{content}</p>
      <div className="mt-4 w-full flex flex-wrap gap-3">
        {actions.map((action) => (
          <SceneAction key={action.text} {...action} storyId={storyId} />
        ))}
      </div>
    </div>
  );
};
