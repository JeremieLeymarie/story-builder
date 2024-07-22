import { WithoutKey } from "@/types";
import { Scene, Story, StoryProgress, User } from "./dexie/dexie-db";

export type LocalRepositoryPort = {
  createStory: (story: WithoutKey<Story>) => Promise<Story>;
  updateStory: (story: Story) => Promise<Story>;
  getStory: (key: string) => Promise<Story | null>;
  getStories: () => Promise<Story[]>;
  getGames: () => Promise<Story[]>;
  getLastGamePlayed: () => Promise<Story | null>;
  updateFirstScene: (storyKey: string, sceneKey: string) => Promise<void>;

  createScene: (scene: WithoutKey<Scene>) => Promise<Scene>;
  createScenes: (scenes: WithoutKey<Scene>[]) => Promise<string[]>;
  updateScene: (scene: Scene) => Promise<Scene>;
  getScene: (key: string) => Promise<Scene | null>;
  getScenes: (storyKey: string) => Promise<Scene[]>;

  createStoryProgress: (
    progress: WithoutKey<StoryProgress>,
  ) => Promise<StoryProgress>;
  updateStoryProgress: (progress: StoryProgress) => Promise<StoryProgress>;
  getStoryProgress: (storyKey: string) => Promise<StoryProgress | null>;
  getStoryProgresses: () => Promise<StoryProgress[]>;
  addAuthorKeyToStories: (userKey: string) => Promise<void>;

  getUser: () => Promise<User | null>;
  createUser: (user: WithoutKey<User>) => Promise<User>;
  updateUser: (user: User) => Promise<User>;
};
