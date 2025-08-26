import { match } from "ts-pattern";
import { cn } from "@/lib/style";
import { SceneForm } from "./scene-editor/scene-form";
import { useBuilderEditorStore } from "@/builder/hooks/use-scene-editor-store";
import { StoryForm } from "./story-editor/story-form";
import { useBuilderContext } from "@/builder/hooks/use-builder-context";
import { Toolbar, ToolbarTitle } from "@/design-system/components/toolbar";

export const EditorBar = () => {
  // Here TS discriminated union won't work if we don't select the whole state
  const state = useBuilderEditorStore();
  const { story } = useBuilderContext();

  if (!state.type) return null;

  return (
    <Toolbar className={cn("min-w-[450px]", state.type === null && "hidden")}>
      <ToolbarTitle className="mb-2">
        {match(state)
          .with({ type: "scene-editor" }, () => "Edit scene")
          .with({ type: "story-editor" }, () => "Edit story")
          .exhaustive()}
      </ToolbarTitle>
      {match(state)
        .with({ type: "scene-editor" }, ({ payload }) => (
          <SceneForm
            isFirstScene={payload.isFirstScene}
            scene={payload.scene}
          />
        ))
        .with({ type: "story-editor" }, () => (
          <StoryForm defaultValues={story} />
        ))
        .exhaustive()}
    </Toolbar>
  );
};
