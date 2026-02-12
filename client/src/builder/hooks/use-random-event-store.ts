import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import { Action } from "@/lib/storage/domain";

type RandomEventStore = {
  open: (action: Action) => void;
  close: () => void;
  action: Action | null;
};

export const useRandomEventStore = createWithEqualityFn<RandomEventStore>(
  (set) => ({
    action: null,
    open(action) {
      set({ action });
    },
    close() {
      set({ action: null });
    },
  }),
  shallow,
);
