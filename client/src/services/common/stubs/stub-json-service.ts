import { vi } from "vitest";
import { JsonServicePort } from "../json-service";
import { MockPort } from "../../../types";
import { BASIC_SCENE, BASIC_STORY } from "@/repositories/stubs/data";

export type MockJsonService = MockPort<JsonServicePort>;

export const getJsonServiceStub = (): MockJsonService => {
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
