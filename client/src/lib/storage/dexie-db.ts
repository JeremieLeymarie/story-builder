import Dexie, { type EntityTable } from "dexie";

export type User = {
  id: number;
  username?: string;
  password?: string;
};

export type Story = {
  id: number;
  authorId: number;
  title: string;
  description: string;
  image: string;
  status: "draft" | "saved" | "published";
};

export type Action = {
  text: string;
  sceneId: number;
};

export type Scene = {
  id: number;
  storyId: number;
  title: string;
  content: string;
  actions: Action[];
};

export type StoryProgress = {
  id: number;
  storyId: number;
  history: number[];
  currentSceneId: number;
  character?: Record<string, unknown>;
  inventory?: Record<string, unknown>;
};

// TODO: Chapters?

const db = new Dexie("story-builder") as Dexie & {
  users: EntityTable<User, "id">;
  stories: EntityTable<Story, "id">;
  scenes: EntityTable<Scene, "id">;
  storyProgresses: EntityTable<StoryProgress, "id">;
};

db.version(1).stores({
  users: "++id, username, password",
  stories: "++id, authorId, title, description, image, status",
  scenes: "++id, storyId, title, content, actions",
  storyProgresses:
    "++id, storyId, currentSceneId, character, inventory, history",
});

export { db };
