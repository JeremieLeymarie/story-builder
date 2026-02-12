import { match } from "ts-pattern";
import { cn } from "@/lib/style";
import { useBuilderEditorStore } from "@/builder/hooks/use-builder-editor-store";
import { Toolbar } from "@/design-system/components/toolbar";
import { StoryEditor, StoryEditorHeader } from "./story-editor/story-editor";
import { SceneEditor, SceneEditorHeader } from "./scene-editor/scene-editor";
import {
  RandomEventEditor,
  RandomEventEditorHeader,
} from "./scene-editor/random-event-editor";
import { useRandomEventStore } from "@/builder/hooks/use-random-event-store";

export const EditorBar = () => {
  const currentEditor = useBuilderEditorStore((state) => state.editor);
  const isRandomActionEditorOpen = useRandomEventStore(
    (state) =>
      currentEditor?.type === "scene-editor" &&
      state.action &&
      state.action.targets.length >= 2,
  );

  if (!currentEditor) return null;

  return (
    <div className="flex">
      {isRandomActionEditorOpen && (
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
