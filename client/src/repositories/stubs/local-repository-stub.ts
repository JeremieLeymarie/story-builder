import { LocalRepositoryPort } from "../local-repository-port";
import {
  BASIC_SCENE,
  BASIC_STORY,
  BASIC_STORY_PROGRESS,
  BASIC_USER,
} from "./data";

const P =
  <T>(returnValue?: T) =>
  () =>
    new Promise<T>((res) => res(returnValue as T));

export const getLocalRepositoryStub = (): LocalRepositoryPort => {
  return {
    createStory: P(BASIC_STORY),

    createStoryWithFirstScene: P({ story: BASIC_STORY, scene: BASIC_SCENE }),

    updateOrCreateStories: P(["key"]),

    updateStory: P(BASIC_STORY),

    getStory: P(BASIC_STORY),

    getStoriesByKeys: P([BASIC_STORY]),

    getStoriesByAuthor: P([BASIC_STORY]),

    getGames: P([BASIC_STORY]),

    getMostRecentStoryProgress: P(BASIC_STORY_PROGRESS),

    getFinishedGameKeys: P(["key"]),

    updateFirstScene: P(),

    addAuthorToStories: P(),

    updateOrCreateScenes: P(["key"]),

    createScene: P(BASIC_SCENE),

    createScenes: P(["key"]),

    updatePartialScene: P(true),

    updateScenes: P(),

    getScene: P(BASIC_SCENE),

    getScenes: P([BASIC_SCENE]),

    createStoryProgress: P(BASIC_STORY_PROGRESS),

    updateOrCreateStoryProgresses: P(["key"]),

    updateStoryProgress: P(BASIC_STORY_PROGRESS),

    getStoryProgress: P(BASIC_STORY_PROGRESS),

    getStoryProgresses: P([BASIC_STORY_PROGRESS]),

    getUser: P(BASIC_USER),

    getUserCount: P(1),

    createUser: P(BASIC_USER),

    updateUser: P(BASIC_USER),

    deleteUser: P(true),

    unitOfWork: (work) => work(),
  };
};
