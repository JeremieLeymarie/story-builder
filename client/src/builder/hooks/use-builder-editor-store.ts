import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";

type EditorBase<Type, Payload> = {
  type: Type;
  payload: Payload;
};

type SceneEditorStore = EditorBase<
  "scene-editor",
  {
    sceneKey: string;
    isFirstScene: boolean;
  }
>;

type StoryEditorStore = EditorBase<"story-editor", null>;

type CharacterEditor = EditorBase<"character-editor", null>;

type Editors = SceneEditorStore | StoryEditorStore | CharacterEditor | null;

type BuilderStore = {
  open: (editor: Exclude<Editors, null>) => void;
  close: () => void;
  editor: Editors;
};

export const useBuilderEditorStore = createWithEqualityFn<BuilderStore>(
  (set) => ({
    editor: null,
    open(editor) {
      set({ editor });
    },
    close() {
      set({ editor: null });
    },
  }),
  shallow,
);
