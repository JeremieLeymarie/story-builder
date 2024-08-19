import Dexie, { type EntityTable } from "dexie";
import { nanoid } from "nanoid";
import { User, Story, Scene, StoryProgress } from "../domain";

// TODO: move this file in a more appropriate location

export const db = new Dexie("story-builder") as Dexie & {
  user: EntityTable<User, "key">;
  stories: EntityTable<Story, "key">;
  scenes: EntityTable<Scene, "key">;
  storyProgresses: EntityTable<StoryProgress, "key">;
};

db.version(1).stores({
  user: "&key, username, email",
  stories:
    "&key, firstSceneKey, title, description, image, status, genres, publicationDate, creationDate, author, finished",
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
              if (!value.key) {
                Dexie.setByKeyPath(
                  value,
                  table.schema.primaryKey.keyPath!,
                  nanoid(),
                );
              }
            });
          }

          return table.mutate(req);
        },
      };
    },
  }),
});
