import { vi } from "vitest";
import { ImportServicePort } from "../import-service";
import { MockPort } from "../../../types";
import { BASIC_SCENE, BASIC_STORY } from "@/repositories/stubs/data";

export type MockImportService = MockPort<ImportServicePort>;

export const getImportServiceStub = (): MockImportService => {
  return {
    createScenes: vi.fn(() => Promise.resolve({ isOk: true, data: null })),
    createStory: vi.fn(() =>
      Promise.resolve({ isOk: true, data: BASIC_STORY }),
    ),
    parseJSON: vi.fn(() => ({
      isOk: true,
      data: {
        story: {
          ...BASIC_STORY,
          author: { key: "bob-bidou", username: " bob-bidou" },
        },
        scenes: [BASIC_SCENE],
      },
    })),
  };
};
