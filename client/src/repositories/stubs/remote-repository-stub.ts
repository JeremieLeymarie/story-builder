/* eslint-disable @typescript-eslint/no-unused-vars */
import { Scene, Story, User, StoryProgress } from "@/lib/storage/domain";
import {
  RemoteRepositoryPort,
  RemoteRepositoryResponse,
} from "../remote-repository-port";

type RemoteStorage = {
  stories: (Story & { scenes: Scene[] })[];
  storyProgresses: StoryProgress[];
  users: User[];
};

let storage: RemoteStorage = {
  stories: [],
  storyProgresses: [],
  users: [],
};

export const stubRemoteStorageAccessors = {
  createStory: (story: Story & { scenes: Scene[] }) => {
    storage.stories = [...storage.stories, story];
  },
};

export const getRemoteRepositoryStub = (): RemoteRepositoryPort => {
  storage = {
    stories: [],
    storyProgresses: [],
    users: [],
  };

  return {
    publishStory: function (
      scenes: Scene[],
      story: Story,
    ): Promise<RemoteRepositoryResponse<{ story: Story; scenes: Scene[] }>> {
      const idx = storage.stories.findIndex((s) => s.key === story.key);

      if (idx === -1) {
        return new Promise((res) => res({ error: "Story not found" }));
      }
      const s = { ...story, scenes, status: "published" as const };
      storage.stories[idx] = s;

      const { scenes: updatedScenes, ...updatedStory } = s;
      return new Promise((res) =>
        res({ data: { scenes: updatedScenes, story: updatedStory } }),
      );
    },

    login: function (
      _usernameOrEmail: string,
      _password: string,
    ): Promise<RemoteRepositoryResponse<User>> {
      throw new Error("Function not implemented.");
    },
    register: function (
      _user: User & { password: string },
    ): Promise<RemoteRepositoryResponse<User>> {
      throw new Error("Function not implemented.");
    },
    getStoreItems: function (): Promise<RemoteRepositoryResponse<Story[]>> {
      throw new Error("Function not implemented.");
    },
    downloadStory: function (
      _storyKey: string,
    ): Promise<RemoteRepositoryResponse<{ story: Story; scenes: Scene[] }>> {
      throw new Error("Function not implemented.");
    },
    saveStoryProgresses: function (
      _storyProgresses: StoryProgress[],
      _userKey: string,
    ): Promise<RemoteRepositoryResponse<StoryProgress[]>> {
      throw new Error("Function not implemented.");
    },
    saveStories: function (
      _stories: Story[],
      _scenes: Scene[],
    ): Promise<
      RemoteRepositoryResponse<{ message?: string | null; success: boolean }>
    > {
      throw new Error("Function not implemented.");
    },
    getSynchronizationData: function (_userKey: string): Promise<
      RemoteRepositoryResponse<{
        playerGames: { stories: Story[]; scenes: Scene[] };
        builderGames: { stories: Story[]; scenes: Scene[] };
        storyProgresses: StoryProgress[];
      }>
    > {
      throw new Error("Function not implemented.");
    },
  };
};
