import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import { EditActionsSchema } from "./use-edit-actions-form";
import { FieldArrayWithId } from "node_modules/react-hook-form/dist/types/fieldArray";

type RandomEventStore = {
  open: (action: FieldArrayWithId<EditActionsSchema, "actions", "id">) => void;
  close: () => void;
  action: FieldArrayWithId<EditActionsSchema, "actions", "id"> | null;
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
