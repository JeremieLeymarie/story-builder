import { vi } from "vitest";
import { MockPort } from "@/types";
import { nanoid } from "nanoid";
import { getTestFactory } from "@/lib/testing/factory";
import { BuilderSceneRepositoryPort } from "../builder-scene-repository";

const factory = getTestFactory();

export type MockBuilderSceneRepository = MockPort<BuilderSceneRepositoryPort>;

export const getStubBuilderSceneRepository =
  (): MockBuilderSceneRepository => ({
    get: vi.fn(() => Promise.resolve(factory.scene())),
    getScenesByKey: vi.fn(),
    create: vi.fn((payload) => Promise.resolve({ ...payload, key: nanoid() })),
    bulkAdd: vi.fn(() => Promise.resolve([nanoid()])),
    bulkUpdate: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  });
