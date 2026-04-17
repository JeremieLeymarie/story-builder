import { vi } from "vitest";
import { ImportExportServicePort } from "../import-export-service";
import { MockPort } from "../../../types";
import { BASIC_SCENE, BASIC_STORY } from "@/repositories/stubs/data";

export type MockImportExportService = MockPort<ImportExportServicePort>;

export const getImportExportServiceStub = (): MockImportExportService => {
  return {
    createScenes: vi.fn(() => Promise.resolve({})),
    createStory: vi.fn(() =>
      Promise.resolve({ isOk: true, data: BASIC_STORY }),
    ),
    createTheme: vi.fn(),
    createCharacterConfig: vi.fn(),
    createWiki: vi.fn(() => Promise.resolve()),
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
