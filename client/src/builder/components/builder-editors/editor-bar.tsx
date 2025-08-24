import { match } from "ts-pattern";
import { cn } from "@/lib/style";
import { useBuilderEditorStore } from "./hooks/use-scene-editor-store";
import { SceneEditorContent } from "./scene-editor/scene-editor";
import { Bar } from "@/design-system/components/bar";

export const EditorBar = () => {
  // Here TS discriminated union won't work if we don't select the whole state
  const state = useBuilderEditorStore();

  return (
    <Bar className={cn("min-w-[450px]", state.type === null && "hidden")}>
      {match(state)
        .with({ type: "scene-editor" }, ({ payload }) => (
          <SceneEditorContent
            isFirstScene={payload.isFirstScene}
            scene={payload.scene}
          />
        ))
        .with({ type: null }, () => null)
        .exhaustive()}
    </Bar>
  );
};
