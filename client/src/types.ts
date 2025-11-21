import { Mock } from "vitest";

export type WithoutKey<T extends { key: string }> = Omit<T, "key">;

export type MaybeWithoutKey<T extends { key: string }> = Omit<T, "key"> | T;

// This type allows to type stub services/repositories while keeping methods typing + vitest's mock definition
export type MockPort<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TPort extends Record<string, (...args: any[]) => unknown>,
> = {
  [K in keyof TPort]: Mock<TPort[K]>;
};
