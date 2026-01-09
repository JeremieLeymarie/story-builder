import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import { SceneUpdatePayload } from "../components/builder-editor-bar/scene-editor/schema";

type EditorBase<Type, Payload> = {
  type: Type;
  payload: Payload;
};

type SceneEditorStore = EditorBase<
  "scene-editor",
  { scene: SceneUpdatePayload; isFirstScene: boolean }
>;

type StoryEditorStore = EditorBase<"story-editor", null>;

type Editors = SceneEditorStore | StoryEditorStore | null;

type BuilderStore = {
  open: (editor: Exclude<Editors, null>) => void;
  close: () => void;
  updatePayload: (editor: Exclude<Editors, null>) => void;
  editor: Editors;
};

export const EMPTY_BUILDER_EDITOR_STATE: EditorBase<null, null> = {
  type: null,
  payload: null,
};

export const useBuilderEditorStore = createWithEqualityFn<BuilderStore>(
  (set, get) => ({
    editor: null,
    open(editor) {
      set({ editor });
    },
    close() {
      set({ editor: null });
    },
    updatePayload(editor) {
      if (editor.type !== get().editor?.type)
        throw new Error(
          `Cannot update ${editor.type}'s type: this editor is not open.`,
        );
      set({ editor });
    },
  }),
  shallow,
);
