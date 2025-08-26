import { vi } from "vitest";
import { getTestFactory } from "@/lib/testing/factory";
import { BuilderStoryRepositoryPort } from "../ports/builder-story-repository-port";
import { MockPort } from "@/types";

export type MockBuilderStoryRepository = MockPort<BuilderStoryRepositoryPort>;

const factory = getTestFactory();

export const getStubBuilderStoryRepository =
  (): MockBuilderStoryRepository => ({
    get: vi.fn(() => Promise.resolve(factory.story.builder())),
    update: vi.fn(() => Promise.resolve(factory.story.builder())),
  });
