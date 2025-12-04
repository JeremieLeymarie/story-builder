import { MockPort } from "@/types";
import { ThemeRepositoryPort } from "../theme-repository";
import { getTestFactory } from "@/lib/testing/factory";
import { vi } from "vitest";

const factory = getTestFactory();
export type MockThemeRepository = MockPort<ThemeRepositoryPort>;

export const getStubThemeRepository = (): MockThemeRepository => ({
  get: vi.fn(() => Promise.resolve(factory.storyTheme())),
  create: vi.fn(),
  update: vi.fn(),
});
