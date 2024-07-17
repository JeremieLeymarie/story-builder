import Dexie, { type EntityTable } from "dexie";
import { nanoid } from "nanoid";

export type User = {
  key: string;
  username: string;
  email: string;
};

export const STORY_STATUS = ["draft", "saved", "published"] as const;
export type StoryStatus = (typeof STORY_STATUS)[number];

export type Story = {
  key: string;
  authorKey?: string;
  title: string;
  description: string;
  image: string;
  status: StoryStatus;
  firstSceneKey?: string;
};

export type Action = {
  text: string;
  sceneKey?: string;
};

export type Scene = {
  key: string;
  storyKey: string;
  title: string;
  content: string;
  actions: Action[];
  builderParams: { position: { x: number; y: number } };
};

export type StoryProgress = {
  key: string;
  storyKey: string;
  history: string[];
  currentSceneKey: string;
  character?: Record<string, unknown>;
  inventory?: Record<string, unknown>;
  lastPlayedAt: Date;
};

// TODO: Chapters?

export const db = new Dexie("story-builder") as Dexie & {
  user: EntityTable<User, "key">;
  stories: EntityTable<Story, "key">;
  scenes: EntityTable<Scene, "key">;
  storyProgresses: EntityTable<StoryProgress, "key">;
};

db.version(1).stores({
  user: "&key, username, email",
  stories: "&key, firstSceneKey, authorKey, title, description, image, status",
  scenes: "&key, storyKey, title, content, actions, builderParams",
  storyProgresses:
    "&key, storyKey, currentSceneKey, character, inventory, history, lastPlayedAt",
});

// Register nanoid middleware
db.use({
  stack: "dbcore",
  name: "primary-key-nanoid-mw",
  create: (core) => ({
    ...core,
    table: (tableName) => {
      const table = core.table(tableName);

      return {
        ...table,
        mutate: (req) => {
          if (req.type === "add") {
            // For every insertion in the database, generate a nanoid and use it as the primary key
            req.values.forEach((value) => {
              Dexie.setByKeyPath(
                value,
                table.schema.primaryKey.keyPath!,
                nanoid()
              );
            });
          }

          return table.mutate(req);
        },
      };
    },
  }),
});
