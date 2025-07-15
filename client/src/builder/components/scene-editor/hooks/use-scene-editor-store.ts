import { create } from "zustand";
import { SceneUpdatePayload } from "../schema";

type SceneEditorStore = {
  scene: SceneUpdatePayload | null;
  isOpen: boolean;
  open: (scene: SceneUpdatePayload) => void;
  close: () => void;
};

export const useSceneEditorStore = create<SceneEditorStore>((set) => ({
  scene: null,
  isOpen: false,
  open: (scene) => set({ isOpen: true, scene }),
  close: () => set({ isOpen: false }),
}));
