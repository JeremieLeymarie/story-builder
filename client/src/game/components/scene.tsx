import { SceneAction } from "./scene-action";
import { Button } from "@/design-system/primitives";
import { LibraryBigIcon } from "lucide-react";

import { Scene, StoryProgress } from "@/lib/storage/domain";
import { Divider } from "@/design-system/components/divider";
import { Link } from "@tanstack/react-router";
import { SerializedEditorState } from "lexical";
import { RichText } from "@/design-system/components/editor/blocks/rich-text-editor";

type GameSceneProps = {
  scene: Scene;
  isLastScene: boolean;
  progress: StoryProgress | null;
};

export const GameScene = ({
  progress,
  scene: { content, title, actions, storyKey },
  isLastScene,
}: GameSceneProps) => {
  return (
    <div className="flex w-full justify-center py-8">
      <div className="w-11/12 lg:w-8/12">
        <div className="w-full px-6 py-8">
          <div>
            <h1 className="scroll-m-20 text-3xl font-bold tracking-tight lg:text-4xl">
              {title}
            </h1>
            <p className="leading-7 wrap-break-word not-first:mt-6">
              <RichText
                editable={false}
                initialState={content as unknown as SerializedEditorState}
              />
            </p>
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
            <Divider className="w-4/12" />
            <p className="text-muted-foreground w-10/12 text-center italic lg:w-6/12">
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
