import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";

// ⚠️ The id should be unique among errors of the same type
type _ErrorBase<Type extends string> = { type: Type; id: string };

type _BuilderError<
  Type extends string,
  Payload extends object | null = null,
> = {} & Payload extends null
  ? _ErrorBase<Type>
  : _ErrorBase<Type> & { payload: Payload };

type InvalidActionTargetPercentages =
  _BuilderError<"invalid-action-target-percentages">;

type BuilderError = InvalidActionTargetPercentages;

type BuilderErrorStore = {
  errors: Record<BuilderError["type"], BuilderError[]>;
  errorCount: number;
  addOrReplaceError: (error: BuilderError) => void;
  removeError: (error: BuilderError) => void;
};

export const useBuilderErrorStore = createWithEqualityFn<BuilderErrorStore>(
  (set, get) => ({
    errors: {
      "invalid-action-target-percentages": [],
    },
    errorCount: Object.values(get().errors).flat().length,

    addOrReplaceError: (newError) => {
      const { errors } = get();
      const errorExists =
        errors[newError.type]?.findIndex(
          (errorInStore) => errorInStore.id === newError.id,
        ) !== -1;

      // Replace error in store if exists
      if (errorExists) {
        set({
          errors: {
            ...errors,
            [newError.type]: errors[newError.type]!.map((errorInStore) =>
              errorInStore.id === newError.id ? newError : errorInStore,
            ),
          },
        });
        // Or just append it otherwise
      } else {
        set({
          errors: {
            ...errors,
            [newError.type]: [...(errors[newError.type] ?? []), newError],
          },
        });
      }
    },

    removeError: (errorToRemove) => {
      const { errors } = get();
      set({
        errors: {
          ...errors,
          [errorToRemove.type]: errors[errorToRemove.type].filter(
            (errorInStore) => errorInStore.id === errorToRemove.id,
          ),
        },
      });
    },
  }),
  shallow,
);
