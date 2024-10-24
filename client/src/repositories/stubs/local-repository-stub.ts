import { Mock, vi } from "vitest";
import { LocalRepositoryPort } from "../local-repository-port";
import {
  BASIC_SCENE,
  BASIC_STORY,
  BASIC_STORY_PROGRESS,
  BASIC_USER,
} from "./data";

const mock = <T>(returnValue?: T) =>
  vi.fn(() => new Promise<T>((res) => res(returnValue as T)));

export type MockLocalRepository = {
  [K in keyof LocalRepositoryPort]: Mock<LocalRepositoryPort[K]>;
};

export const getLocalRepositoryStub = (): MockLocalRepository => {
  return {
    createStory: mock(BASIC_STORY),

    createStoryWithFirstScene: mock({ story: BASIC_STORY, scene: BASIC_SCENE }),

    updateOrCreateStories: mock(["key"]),

    updateStory: mock(BASIC_STORY),

    getStory: mock(BASIC_STORY),

    getStoriesByKeys: mock([BASIC_STORY]),

    getStoriesByAuthor: mock([BASIC_STORY]),

    getGames: mock([BASIC_STORY]),

    getMostRecentStoryProgress: mock(BASIC_STORY_PROGRESS),

    getFinishedGameKeys: mock(["key"]),

    updateFirstScene: mock(),

    addAuthorToStories: mock(),

    updateOrCreateScenes: mock(["key"]),

    createScene: mock(BASIC_SCENE),

    createScenes: mock(["key"]),

    updatePartialScene: mock(true),

    updateScenes: mock(),

    getScene: mock(BASIC_SCENE),

    getScenes: mock([BASIC_SCENE]),

    getScenesByStoryKey: mock([BASIC_SCENE]),

    deleteScenes: mock(),

    createStoryProgress: mock(BASIC_STORY_PROGRESS),

    updateOrCreateStoryProgresses: mock(["key"]),

    updateStoryProgress: mock(BASIC_STORY_PROGRESS),

    getStoryProgress: mock(BASIC_STORY_PROGRESS),

    getStoryProgresses: mock([BASIC_STORY_PROGRESS]),

    getStoryProgressesOrderedByDate: mock([BASIC_STORY_PROGRESS]),

    getUserStoryProgresses: mock([BASIC_STORY_PROGRESS]),

    getUser: mock(BASIC_USER),

    getUserCount: mock(1),

    createUser: mock(BASIC_USER),

    updateUser: mock(BASIC_USER),

    deleteUser: mock(true),

    unitOfWork: vi.fn((work) => work()),
  };
};
