import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import { SceneUpdatePayload } from "../scene-editor/schema";

type EditorBase<Type, Payload> = {
  type: Type;
  payload: Payload;
};

type SceneEditorStore = EditorBase<
  "scene-editor",
  { scene: SceneUpdatePayload; isFirstScene: boolean }
>;

type Editors = SceneEditorStore | EditorBase<null, null>;

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
      set({ type, payload });
    },
    close() {
      set(EMPTY_BUILDER_EDITOR_STATE);
    },
  }),
  shallow,
);
