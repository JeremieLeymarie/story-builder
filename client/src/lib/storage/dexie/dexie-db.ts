import Dexie, { type EntityTable } from "dexie";

export type User = {
  id: number;
  mongoId?: string;
  username: string;
  email: string;
  password?: string;
};

export type Story = {
  id: number;
  mongoId?: string;
  authorId?: number;
  title: string;
  description: string;
  image: string;
  status: "draft" | "saved" | "published";
  firstSceneId?: number;
};

export type Action = {
  text: string;
  sceneId?: number;
};

export type Scene = {
  id: number;
  mongoId?: string;
  storyId: number;
  title: string;
  content: string;
  actions: Action[];
  builderParams: { position: { x: number; y: number } };
};

export type StoryProgress = {
  id: number;
  mongoId?: string;
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
  user: "++id, mongoId, username, password, email",
  stories:
    "++id, mongoId, firstSceneId, authorId, title, description, image, status",
  scenes: "++id, mongoId, storyId, title, content, actions, builderParams",
  storyProgresses:
    "++id, mongoId, storyId, currentSceneId, character, inventory, history",
});
