import { match } from "ts-pattern";
import { cn } from "@/lib/style";
import { useBuilderEditorStore } from "@/builder/hooks/use-scene-editor-store";
import { Toolbar } from "@/design-system/components/toolbar";
import { StoryEditor, StoryEditorHeader } from "./story-editor/story-editor";
import { SceneEditor, SceneEditorHeader } from "./scene-editor/scene-editor";

export const EditorBar = () => {
  const currentEditor = useBuilderEditorStore((state) => state.editor);

  if (!currentEditor) return null;

  return (
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
  );
};
