import { Mock, vi } from "vitest";
import {
  RemoteRepositoryPort,
  RemoteRepositoryResponse,
} from "../remote-repository-port";
import {
  BASIC_SCENE,
  BASIC_STORY,
  BASIC_STORY_PROGRESS,
  BASIC_USER,
} from "./data";

const P = <T>(returnValue: T) =>
  vi.fn(
    () =>
      new Promise<RemoteRepositoryResponse<T>>((res) =>
        res({ data: returnValue }),
      ),
  );

export type MockRemoteRepository = {
  [K in keyof RemoteRepositoryPort]: Mock<RemoteRepositoryPort[K]>;
};

export const getRemoteRepositoryStub = (): MockRemoteRepository => {
  return {
    login: P(BASIC_USER),

    register: P({ ...BASIC_USER, password: "secret" }),

    saveStoryProgresses: P([BASIC_STORY_PROGRESS]),

    saveStories: P({ success: true }),

    getSynchronizationData: P({
      playerGames: { stories: [BASIC_STORY], scenes: [BASIC_SCENE] },
      builderGames: { stories: [BASIC_STORY], scenes: [BASIC_SCENE] },
      storyProgresses: [BASIC_STORY_PROGRESS],
    }),
  };
};
