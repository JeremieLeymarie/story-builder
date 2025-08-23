import { create } from "zustand";

type ExportModalStore = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
};

export const useExportModalStore = create<ExportModalStore>((set) => ({
  isOpen: false,
  setOpen(isOpen) {
    set({ isOpen });
  },
}));
