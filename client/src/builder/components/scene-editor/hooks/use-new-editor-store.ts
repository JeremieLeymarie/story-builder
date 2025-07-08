import { create } from "zustand";

type NewEditorStore = {
  sceneKey: string | null;
  isOpen: boolean;
  open: (sceneKey: string) => void;
  close: () => void;
};

export const useNewEditorStore = create<NewEditorStore>((set) => ({
  sceneKey: null,
  isOpen: false,
  open: (sceneKey) => set({ isOpen: true, sceneKey }),
  close: () => set({ isOpen: false }),
}));
