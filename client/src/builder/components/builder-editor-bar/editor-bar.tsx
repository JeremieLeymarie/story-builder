import { match } from "ts-pattern";
import { cn } from "@/lib/style";
import { useBuilderEditorStore } from "@/builder/hooks/use-builder-editor-store";
import { Toolbar } from "@/design-system/components/toolbar";
import { StoryEditor, StoryEditorHeader } from "./story-editor/story-editor";
import { SceneEditor, SceneEditorHeader } from "./scene-editor/scene-editor";
import {
  RandomEventEditor,
  RandomEventEditorHeader,
} from "./scene-editor/Random-event-editor";
import { useRandomEventStore } from "@/builder/hooks/use-random-event-store";

export const EditorBar = () => {
  const currentEditor = useBuilderEditorStore((state) => state.editor);
  const currentAction = useRandomEventStore((state) => state.action);

  if (!currentEditor) return null;

  return (
    <div className="flex">
      {currentEditor.type === "scene-editor" &&
        currentAction &&
        currentAction?.targets.length >= 2 && (
          <Toolbar>
            <RandomEventEditorHeader />
            <RandomEventEditor />
          </Toolbar>
        )}
      <Toolbar
        className={cn("w-[500px]", currentEditor.type === null && "hidden")}
      >
        {match(currentEditor)
          .with({ type: "scene-editor" }, () => <SceneEditorHeader />)
          .with({ type: "story-editor" }, () => <StoryEditorHeader />)
          .exhaustive()}
        {match(currentEditor)
          .with({ type: "scene-editor" }, ({ payload }) => (
            <SceneEditor scene={payload.scene} />
          ))
          .with({ type: "story-editor" }, () => <StoryEditor />)
          .exhaustive()}
      </Toolbar>
    </div>
  );
};
