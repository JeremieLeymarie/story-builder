import { WithoutKey } from "@/types";
import { Story, Scene, StoryProgress, User } from "./domain";

export type LocalRepositoryPort = {
  createStory: (story: Story | WithoutKey<Story>) => Promise<Story | null>;
  createStoryWithFirstScene: (props: {
    story: WithoutKey<Omit<Story, "firstSceneKey">>;
    firstScene: WithoutKey<Omit<Scene, "storyKey">>;
  }) => Promise<Story | null>;
  updateOrCreateStories: (stories: Story[]) => Promise<string[]>;
  updateStory: (story: Story) => Promise<Story>;
  getStory: (key: string) => Promise<Story | null>;
  getStories: () => Promise<Story[]>;
  getGames: () => Promise<Story[]>;
  getLastGamePlayed: () => Promise<Story | null>;
  updateFirstScene: (storyKey: string, sceneKey: string) => Promise<void>;

  createScene: (scene: WithoutKey<Scene>) => Promise<Scene>;
  updateOrCreateScenes: (scenes: Scene[]) => Promise<string[]>;
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
  addAuthorToStories: (author: {
    key: string;
    username: string;
  }) => Promise<void>;

  getUser: () => Promise<User | null>;
  createUser: (user: WithoutKey<User>) => Promise<User>;
  updateUser: (user: User) => Promise<User>;
};
