import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import { InvalidActionTargetPercentagesError } from "../builder-errors";

// ⚠️ The id should be unique among errors of the same type
type _ErrorBase<Type extends string> = { type: Type; id: string };

export type _GenericBuilderError<
  Type extends string,
  Payload extends object | null = null,
> = {} & Payload extends null
  ? _ErrorBase<Type>
  : _ErrorBase<Type> & { payload: Payload };

type BuilderErrorWithoutMetadata = InvalidActionTargetPercentagesError;

export type BuilderError = BuilderErrorWithoutMetadata & {
  metadata: { occurredAt: Date };
};

type BuilderErrorStore = {
  errors: Record<BuilderError["type"], BuilderError[]>;
  getErrorCount: () => number;
  /**
   * Tries to add an error and replace the existing one for the same type-id combo if found
   * @param error the error to add or replace
   */
  addOrReplaceError: (error: BuilderErrorWithoutMetadata) => void;
  /**
   * Tries to remove an error and does nothing if it doesn't exist
   * @param error the error to try to remove
   */
  maybeRemoveError: (error: BuilderErrorWithoutMetadata) => void;
  hasError: (
    type: BuilderErrorWithoutMetadata["type"],
    id: BuilderErrorWithoutMetadata["id"],
  ) => boolean;
  clear: () => void;
};

export const useBuilderErrorStore = createWithEqualityFn<BuilderErrorStore>(
  (set, get) => ({
    errors: {
      "invalid-action-target-percentages": [],
    },
    getErrorCount: () => Object.values(get().errors).flat().length,

    addOrReplaceError: (newError) => {
      const { errors } = get();
      const errorExists =
        errors[newError.type]?.findIndex(
          (errorInStore) => errorInStore.id === newError.id,
        ) !== -1;
      const errorWithMetadata = {
        ...newError,
        metadata: { occurredAt: new Date() },
      } satisfies BuilderError;

      // Replace error in store if exists
      if (errorExists) {
        set({
          errors: {
            ...errors,
            [newError.type]: errors[newError.type]!.map((errorInStore) =>
              errorInStore.id === newError.id
                ? errorWithMetadata
                : errorInStore,
            ),
          },
        });
        // Or just append it otherwise
      } else {
        set({
          errors: {
            ...errors,
            [newError.type]: [
              ...(errors[newError.type] ?? []),
              errorWithMetadata,
            ],
          },
        });
      }
    },

    maybeRemoveError: (errorToRemove) => {
      const { errors } = get();
      set({
        errors: {
          ...errors,
          [errorToRemove.type]: errors[errorToRemove.type].filter(
            (errorInStore) => errorInStore.id !== errorToRemove.id,
          ),
        },
      });
    },

    hasError: (type, id) => {
      return get().errors[type].some((err) => err.id === id);
    },

    clear: () =>
      set({
        errors: {
          "invalid-action-target-percentages": [],
        },
      }),
  }),
  shallow,
);
