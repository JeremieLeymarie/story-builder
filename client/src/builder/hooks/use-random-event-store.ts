import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";

type RandomEventPayload = {
  sceneKey: string;
  actionKey: string;
};

type RandomEventStore = {
  open: (action: RandomEventPayload) => void;
  close: () => void;
  payload: RandomEventPayload | null;
};

export const useRandomEventStore = createWithEqualityFn<RandomEventStore>(
  (set) => ({
    payload: null,
    open(payload) {
      set({ payload });
    },
    close() {
      set({ payload: null });
    },
  }),
  shallow,
);
