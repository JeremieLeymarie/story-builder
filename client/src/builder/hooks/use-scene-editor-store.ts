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

type ClosedEditor = EditorBase<null, null>;

type Editors = SceneEditorStore | StoryEditorStore | ClosedEditor;

type BuilderStore = {
  open: (props: Exclude<Editors, { type: null }>) => void;
  close: () => void;
} & Editors;

export const EMPTY_BUILDER_EDITOR_STATE: EditorBase<null, null> = {
  type: null,
  payload: null,
};

export const useBuilderEditorStore = createWithEqualityFn<BuilderStore>(
  (set) => ({
    type: null,
    payload: null,
    open({ type, payload }) {
      // @ts-expect-error Zustand can't handle the discriminated union here
      set({ type, payload });
    },
    close() {
      set(EMPTY_BUILDER_EDITOR_STATE);
    },
  }),
  shallow,
);
