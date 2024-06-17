import { Scene, Story, StoryProgress } from "./dexie-db";

// TODO: define format & better naming
export type ReactFlowData = {};
export type IndexedDBData = {};

type WithoutId<T> = Omit<T, "id">;

export type IndexedDBRepositoryPort = {
  createStory: (story: WithoutId<Story>) => Awaited<Story>;
  updateStory: (story: Story) => Awaited<Story>;
  deleteStory: (id: number) => Awaited<Story>;
  getStory: (id: number) => Awaited<Story>;
  getStories: () => Awaited<Story[]>;

  createScene: (scene: WithoutId<Scene>) => Awaited<Scene>;
  updateScene: (scene: Scene) => Awaited<Scene>;
  deleteScene: (id: number) => Awaited<void>;
  getScene: (id: number) => Awaited<Scene>;
  getScenes: () => Awaited<Scene[]>;

  createStoryProgress: (
    progress: WithoutId<StoryProgress>
  ) => Awaited<StoryProgress>;
  updateStoryProgress: (progress: StoryProgress) => Awaited<StoryProgress>;
  deleteStoryProgress: (id: number) => Awaited<void>;
  getStoryProgress: (id: number) => Awaited<StoryProgress>;
  getStoryProgresses: () => Awaited<StoryProgress[]>;
};
