import { MockPort } from "@/types";
import { BuilderServicePort } from "../ports/builder-service-port";
import { vi } from "vitest";

export type MockBuilderService = MockPort<BuilderServicePort>;

export const getStubBuilderService = (): MockBuilderService => ({
  addScene: vi.fn(),
  addSceneConnection: vi.fn(),
  bulkUpdateScenes: vi.fn(),
  changeFirstScene: vi.fn(),
  createStoryWithFirstScene: vi.fn(),
  deleteScenes: vi.fn(),
  deleteStory: vi.fn(),
  duplicateScenes: vi.fn(),
  getAllBuilderData: vi.fn(),
  getAutoLayout: vi.fn(),
  getBuilderStoryData: vi.fn(),
  getUserBuilderStories: vi.fn(),
  importStory: vi.fn(),
  loadBuilderState: vi.fn(),
  makeEmptyActionPayload: vi.fn(),
  removeSceneConnection: vi.fn(),
  updateScene: vi.fn(),
  updateSceneBuilderPosition: vi.fn(),
  updateStory: vi.fn(),
});
