import { WithoutKey } from "@/types";
import {
  Story,
  Scene,
  StoryProgress,
  User,
  Entity,
} from "../lib/storage/domain";

// TODO: Decide once and for all if we "| null" everywhere or not
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
  getStoriesByKeys: (keys: string[]) => Promise<Story[]>;
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
  createScenes: (scenes: (WithoutKey<Scene> | Scene)[]) => Promise<string[]>;
  updatePartialScene: (key: string, scene: Partial<Scene>) => Promise<boolean>;
  getScene: (key: string) => Promise<Scene | null>;
  getScenes: (storyKeys: string | string[]) => Promise<Scene[]>;

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
  getMostRecentStoryProgress: () => Promise<StoryProgress | null>;

  getUser: () => Promise<User | null>;
  getUserCount: () => Promise<number>;
  createUser: (user: WithoutKey<User>) => Promise<User>;
  updateUser: (user: User) => Promise<User>;
  deleteUser: (key: string) => Promise<boolean>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unitOfWork: <TWork extends (...args: any[]) => any>(
    work: TWork,
    options: { mode?: "readwrite" | "readonly"; entities: Entity[] },
  ) => ReturnType<TWork>;
};
