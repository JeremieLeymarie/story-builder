import Dexie, { type EntityTable } from "dexie";

type UserConfig = {
  lastGamePlayed: number;
};

export type User = {
  id: number;
  remoteId?: string;
  username: string;
  email: string;
  password?: string;
  config: UserConfig;
};

export const STORY_STATUS = ["draft", "saved", "published"] as const;
export type StoryStatus = (typeof STORY_STATUS)[number];

export type Story = {
  id: number;
  remoteId?: string;
  authorId?: number;
  title: string;
  description: string;
  image: string;
  status: StoryStatus;
  firstSceneId?: number;
};

export type Action = {
  text: string;
  sceneId?: number;
};

export type Scene = {
  id: number;
  storyId: number;
  title: string;
  content: string;
  actions: Action[];
  builderParams: { position: { x: number; y: number } };
};

export type StoryProgress = {
  id: number;
  remoteId?: string;
  storyId: number;
  history: number[];
  currentSceneId: number;
  character?: Record<string, unknown>;
  inventory?: Record<string, unknown>;
};

// TODO: Chapters?

export const db = new Dexie("story-builder") as Dexie & {
  user: EntityTable<User, "id">;
  stories: EntityTable<Story, "id">;
  scenes: EntityTable<Scene, "id">;
  storyProgresses: EntityTable<StoryProgress, "id">;
};

db.version(1).stores({
  user: "++id, remoteId, username, password, email, config",
  stories:
    "++id, remoteId, firstSceneId, authorId, title, description, image, status",
  scenes: "++id, storyId, title, content, actions, builderParams",
  storyProgresses:
    "++id, remoteId, storyId, currentSceneId, character, inventory, history",
});
