import { Scene } from "@/lib/storage/dexie/dexie-db";
import { SceneAction } from "./scene-action";

type GameSceneProps = Omit<Scene, "key"> & { sceneKey: string };

export const GameScene = ({
  title,
  actions,
  content,
  storyKey,
}: GameSceneProps) => {
  return (
    <div className="w-full px-6 py-8">
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
  );
};
