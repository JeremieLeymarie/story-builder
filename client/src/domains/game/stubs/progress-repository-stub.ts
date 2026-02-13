import { vi } from "vitest";
import { MockPort } from "@/types";
import { ProgressRepositoryPort } from "../progress-repository";
import { getTestFactory } from "@/lib/testing/factory";

export type MockProgressRepository = MockPort<ProgressRepositoryPort>;

const factory = getTestFactory();

export const getStubProgressRepository = (): MockProgressRepository => {
  return {
    get: vi.fn(() => Promise.resolve(factory.storyProgress())),
  };
};
