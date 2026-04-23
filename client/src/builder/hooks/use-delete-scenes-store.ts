import { create } from "zustand";

type DeleteSceneStore = {
  isOpen: boolean;
  keys: string[];
  open: (keys: string[]) => void;
  close: () => void;
};

export const useDeleteSceneStore = create<DeleteSceneStore>((set) => ({
  isOpen: false,
  keys: [],
  open: (keys) => set({ isOpen: true, keys }),
  close: () => set({ isOpen: false, keys: [] }),
}));
