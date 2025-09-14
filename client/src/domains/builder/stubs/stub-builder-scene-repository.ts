import { vi } from "vitest";
import { BuilderSceneRepositoryPort } from "../ports/builder-scene-repository-port";
import { MockPort } from "@/types";
import { nanoid } from "nanoid";

export type MockBuilderSceneRepository = MockPort<BuilderSceneRepositoryPort>;

export const getStubBuilderSceneRepository =
  (): MockBuilderSceneRepository => ({
    bulkAdd: vi.fn(() => Promise.resolve([nanoid()])),
  });
