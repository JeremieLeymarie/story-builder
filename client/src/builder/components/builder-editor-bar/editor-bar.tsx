import { match } from "ts-pattern";
import { useBuilderEditorStore } from "@/builder/hooks/use-builder-editor-store";
import { StoryEditor } from "./story-editor/story-editor";
import { SceneEditor } from "./scene-editor/scene-editor";
import { CharacterEditor } from "./character-editor/character-editor";

export const EditorBar = () => {
  const currentEditor = useBuilderEditorStore((state) => state.editor);
  if (!currentEditor || currentEditor.type === null) return null;

  return (
    <div className="flex">
      {match(currentEditor)
        .with({ type: "scene-editor" }, ({ payload }) => (
          <SceneEditor sceneKey={payload.sceneKey} />
        ))
        .with({ type: "story-editor" }, () => <StoryEditor />)
        .with({ type: "character-editor" }, () => <CharacterEditor />)
        .exhaustive()}
    </div>
  );
};
