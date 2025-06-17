import { ReactNode } from "react";
import { create } from "zustand";

type Content = ReactNode | string | null;

type BuilderMessageStore = {
  open: boolean;
  setOpen: (props: {
    open: boolean;
    content: Content;
    onCancel?: () => void;
  }) => void;
  content: Content;
  onCancel?: () => void;
};

export const useBuilderMessageStore = create<BuilderMessageStore>((set) => ({
  open: false,
  setOpen: ({ open, content, onCancel }) => set({ open, content, onCancel }),
  content: null,
  onCancel: undefined,
}));
