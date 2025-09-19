import { match } from "ts-pattern";
import { cn } from "@/lib/style";
import { SceneForm } from "./scene-editor/scene-form";
import { useBuilderEditorStore } from "@/builder/hooks/use-scene-editor-store";
import { Toolbar, ToolbarTitle } from "@/design-system/components/toolbar";
import { StoryEditor } from "./story-editor/story-editor";

export const EditorBar = () => {
  const currentEditor = useBuilderEditorStore((state) => state.editor);

  if (!currentEditor) return null;

  return (
    <Toolbar
      className={cn("w-[500px]", currentEditor.type === null && "hidden")}
    >
      <ToolbarTitle className="mb-2">
        {match(currentEditor)
          .with({ type: "scene-editor" }, () => "Edit scene")
          .with({ type: "story-editor" }, () => "Edit story")
          .exhaustive()}
      </ToolbarTitle>
      {match(currentEditor)
        .with({ type: "scene-editor" }, ({ payload }) => (
          <SceneForm
            isFirstScene={payload.isFirstScene}
            scene={payload.scene}
          />
        ))
        .with({ type: "story-editor" }, () => <StoryEditor />)
        .exhaustive()}
    </Toolbar>
  );
};
