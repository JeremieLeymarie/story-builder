import { WithoutId } from "@/types";
import { Scene, Story, StoryProgress, User } from "./dexie/dexie-db";

export type LocalRepositoryPort = {
  createStory: (story: WithoutId<Story>) => Promise<Story>;
  updateStory: (story: Story) => Promise<Story>;
  getStory: (id: number) => Promise<Story | null>;
  getStories: () => Promise<Story[]>;
  getGames: () => Promise<Story[]>;
  getLastGamePlayed: () => Promise<Story | null>;
  updateFirstScene: (storyId: number, sceneId: number) => Promise<void>;

  createScene: (scene: WithoutId<Scene>) => Promise<Scene>;
  createScenes: (scenes: WithoutId<Scene>[]) => Promise<number[]>;
  updateScene: (scene: Scene) => Promise<Scene>;
  getScene: (id: number) => Promise<Scene | null>;
  getScenes: (storyId: number) => Promise<Scene[]>;

  createStoryProgress: (
    progress: WithoutId<StoryProgress>,
  ) => Promise<StoryProgress>;
  updateStoryProgress: (progress: StoryProgress) => Promise<StoryProgress>;
  getStoryProgress: (storyId: number) => Promise<StoryProgress | null>;
  getStoryProgresses: () => Promise<StoryProgress[]>;

  getUser: () => Promise<User | null>;
  createUser: (user: WithoutId<User>) => Promise<User>;
  updateUser: (user: User) => Promise<User>;
};
