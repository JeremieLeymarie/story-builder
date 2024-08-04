import { WithoutKey } from "@/types";
import { Story, Scene, StoryProgress, User } from "../lib/storage/domain";

export type LocalRepositoryPort = {
  createStory: (story: Story | WithoutKey<Story>) => Promise<Story | null>;
  createStoryWithFirstScene: (props: {
    story: WithoutKey<Omit<Story, "firstSceneKey">>;
    firstScene: WithoutKey<Omit<Scene, "storyKey">>;
  }) => Promise<{ story: Story; scene: Scene } | null>;
  updateOrCreateStories: (stories: Story[]) => Promise<string[] | null>;
  updateStory: (story: Story) => Promise<Story>;
  getStory: (key: string) => Promise<Story | null>;
  getStories: () => Promise<Story[] | null>;
  getStoriesByAuthor: (userKey?: string) => Promise<Story[] | null>;
  getGames: () => Promise<Story[]>;
  getLastGamePlayed: () => Promise<Story | null>;
  updateFirstScene: (storyKey: string, sceneKey: string) => Promise<void>;
  addAuthorToStories: (author: {
    key: string;
    username: string;
  }) => Promise<void>;

  createScene: (scene: WithoutKey<Scene>) => Promise<Scene>;
  updateOrCreateScenes: (scenes: Scene[]) => Promise<string[]>;
  createScenes: (scenes: WithoutKey<Scene>[]) => Promise<string[]>;
  updatePartialScene: (key: string, scene: Partial<Scene>) => Promise<boolean>;
  getScene: (key: string) => Promise<Scene | null>;
  getScenes: (storyKey: string) => Promise<Scene[]>;

  createStoryProgress: (
    progress: WithoutKey<StoryProgress>,
  ) => Promise<StoryProgress>;

  updateOrCreateStoryProgresses: (
    progresses: StoryProgress[],
  ) => Promise<string[]>;
  updateStoryProgress: (
    progress: StoryProgress,
  ) => Promise<StoryProgress | null>;
  getStoryProgress: (storyKey: string) => Promise<StoryProgress | null>;
  getStoryProgresses: () => Promise<StoryProgress[]>;
  getFinishedGameKeys: () => Promise<string[]>;

  getUser: () => Promise<User | null>;
  getUserCount: () => Promise<number>;
  createUser: (user: WithoutKey<User>) => Promise<User>;
  updateUser: (user: User) => Promise<User>;
  deleteUser: (key: string) => Promise<boolean>;
};
