import { vi } from "vitest";
import { BuilderSceneRepositoryPort } from "../ports/builder-scene-repository-port";
import { MockPort } from "@/types";
import { nanoid } from "nanoid";
import { getTestFactory } from "@/lib/testing/factory";

const factory = getTestFactory();

export type MockBuilderSceneRepository = MockPort<BuilderSceneRepositoryPort>;

export const getStubBuilderSceneRepository =
  (): MockBuilderSceneRepository => ({
    get: vi.fn(() => Promise.resolve(factory.scene())),
    bulkAdd: vi.fn(() => Promise.resolve([nanoid()])),
  });
