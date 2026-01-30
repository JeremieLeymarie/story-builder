import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import { Scene } from "@/lib/storage/domain";

type EditorBase<Type, Payload> = {
  type: Type;
  payload: Payload;
};

export type SceneUpdatePayload = Pick<
  Scene,
  "key" | "title" | "content" | "actions"
>;

type SceneEditorStore = EditorBase<
  "scene-editor",
  {
    scene: SceneUpdatePayload;
    isFirstScene: boolean;
  }
>;

type StoryEditorStore = EditorBase<"story-editor", null>;

type Editors = SceneEditorStore | StoryEditorStore | null;

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
