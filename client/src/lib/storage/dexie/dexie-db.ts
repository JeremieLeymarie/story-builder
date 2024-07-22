import Dexie, { type EntityTable } from "dexie";
import { nanoid } from "nanoid";

export const STORY_GENRES = [
  "adventure",
  "children",
  "detective",
  "dystopia",
  "fantasy",
  "historical",
  "horror",
  "humor",
  "mystery",
  "romance",
  "science-fiction",
  "thriller",
  "suspense",
  "western",
] as const;
export type StoryGenre = (typeof STORY_GENRES)[number];

export type User = {
  key: string;
  username: string;
  email: string;
};

export const STORY_STATUS = ["draft", "saved", "published"] as const;
export type StoryStatus = (typeof STORY_STATUS)[number];

export type Story = {
  key: string;
  author?: {
    key: string;
    username: string;
  };
  title: string;
  description: string;
  image: string;
  status: StoryStatus;
  firstSceneKey?: string;
  genres: StoryGenre[];
  publicationDate?: Date;
  creationDate: Date;
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

export const db = new Dexie("story-builder") as Dexie & {
  user: EntityTable<User, "key">;
  stories: EntityTable<Story, "key">;
  scenes: EntityTable<Scene, "key">;
  storyProgresses: EntityTable<StoryProgress, "key">;
};

db.version(1).stores({
  user: "&key, username, email",
  stories:
    "&key, firstSceneKey, title, description, image, status, genres, publicationDate, creationDate, author",
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
                nanoid(),
              );
            });
          }

          return table.mutate(req);
        },
      };
    },
  }),
});
