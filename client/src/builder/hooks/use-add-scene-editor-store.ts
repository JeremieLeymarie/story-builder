import { create } from "zustand";

type AddSceneEditorStore = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
};

export const useAddSceneEditorStore = create<AddSceneEditorStore>((set) => ({
  isOpen: false,
  setOpen: (isOpen) => set({ isOpen }),
}));
