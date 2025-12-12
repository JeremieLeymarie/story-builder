"use client";

import { useCallback, useSyncExternalStore } from "react";
import { z } from "zod";

const parseLocalStorage = (value: string | null) => {
  try {
    if (value === null) return null;
    const parsed = JSON.parse(value);
    return parsed;
  } catch (_) {
    return value;
  }
};

const subscribe = (listener: () => void) => {
  // Custom event used by this hook to trigger state changes in the same document
  window.addEventListener("local-storage", listener);
  // Native event triggered when storage changes (only in other documents)
  window.addEventListener("storage", listener);

  return () => {
    window.removeEventListener("local-storage", listener);
    window.removeEventListener("storage", listener);
  };
};

/**
 * Make local storage value reactive by exposing an event-based state similar to react's useState
 * @param key The local storage key to access
 * @returns an array containing the state and the state setter
 */
const useLocalStorage = (key: string) => {
  const state = useSyncExternalStore(subscribe, () =>
    localStorage.getItem(key),
  );

  const setState = useCallback(
    (value: string) => {
      try {
        localStorage.setItem(key, value);
        // Dispatch a custom event to notify other hooks of changes in the same document
        window.dispatchEvent(new StorageEvent("local-storage", { key }));
      } catch (error) {
        console.warn(
          `Error in useLocalStorage while trying to parse into JSON: ${(error as Error).toString()}. Payload:`,
          value,
        );
      }
    },
    [key],
  );

  return [state, setState] as const;
};

type SetterType<T> = ((prev: T) => T) | T;
const isFn = (cb: unknown) => typeof cb === "function";

/**
 * Expose a reactive local storage state, validated by a schema
 * The value is parsed based on the schema shape
 * @param key local storage key to use in URL
 * @param schema schema to validate local storage, needs to have fallback values with .catch()
 * @returns [state, setState]
 */
export const useSafeLocalStorage = <T extends z.ZodType>(
  key: string,
  schema: T,
) => {
  const [rawState, setRawState] = useLocalStorage(key);

  const parsed = schema.parse(parseLocalStorage(rawState) ?? {}) as z.infer<T>;

  const setState = (valueOrCallback: SetterType<z.infer<T>>) => {
    const newValue = isFn(valueOrCallback)
      ? valueOrCallback(parsed)
      : valueOrCallback;
    setRawState(
      typeof newValue === "string" ? newValue : JSON.stringify(newValue),
    );
  };

  return [parsed, setState] as const;
};
