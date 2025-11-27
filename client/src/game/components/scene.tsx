import { SceneAction } from "./scene-action";
import { Button } from "@/design-system/primitives";
import { LibraryBigIcon } from "lucide-react";

import { Scene, StoryProgress } from "@/lib/storage/domain";
import { Divider } from "@/design-system/components/divider";
import { Link } from "@tanstack/react-router";
import { RichText } from "@/design-system/components/editor/components/rich-text-editor";
import { EditorContext } from "@/design-system/components/editor/hooks/use-editor-context";
import { WikiNode } from "@/builder/lexical-wiki-node";

type BaseProps = {
  scene: Scene;
  isLastScene: boolean;
};

type GameModeProps = BaseProps & {
  mode: "game";
  progress: StoryProgress;
};

type TestModeProps = BaseProps & { mode: "test" };

type UIEditorModeProps = BaseProps & { mode: "ui-editor" };

type GameSceneProps = GameModeProps | TestModeProps | UIEditorModeProps;

export const GameScene = (props: GameSceneProps) => {
  const {
    scene: { key, content, title, actions, storyKey },
    isLastScene,
  } = props;
  return (
    <div className="flex w-full justify-center py-8">
      <div className="w-11/12 lg:w-8/12">
        <div className="w-full px-6 py-8">
          <div>
            <h1 className="scroll-m-20 text-3xl font-bold tracking-tight lg:text-4xl">
              {title}
            </h1>
            <div className="leading-7 wrap-break-word not-first:mt-6">
              <EditorContext value={{ entityType: "scene", entityKey: key }}>
                <RichText
                  editable={false}
                  initialState={content}
                  editorNodes={[WikiNode]}
                  textDisplayMode="full"
                />
              </EditorContext>
            </div>
            <div className="mt-4 flex w-full flex-wrap gap-3">
              {actions.map((action) => (
                <SceneAction
                  key={action.text}
                  action={action}
                  storyKey={storyKey}
                  progress={props.mode === "game" ? props.progress : null}
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
