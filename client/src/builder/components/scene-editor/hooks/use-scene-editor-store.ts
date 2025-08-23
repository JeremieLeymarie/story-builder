import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import { SceneUpdatePayload } from "../schema";

type SceneEditorStore = {
  scene: SceneUpdatePayload | null;
  isFirstScene: boolean | null;
  isOpen: boolean;
  open: (props: { scene: SceneUpdatePayload; isFirstScene: boolean }) => void;
  close: () => void;
};

export const EMPTY_STATE: Omit<SceneEditorStore, "open" | "close"> = {
  scene: null,
  isFirstScene: null,
  isOpen: false,
};

export const useSceneEditorStore = createWithEqualityFn<SceneEditorStore>(
  (set) => ({
    scene: null,
    isFirstScene: null,
    isOpen: false,
    open({ scene, isFirstScene }) {
      set({ isOpen: true, scene, isFirstScene });
    },
    close() {
      set(EMPTY_STATE);
    },
  }),
  shallow,
);
