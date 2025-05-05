import Dexie, { type EntityTable } from "dexie";
import { nanoid } from "nanoid";
import { User, Story, Scene, StoryProgress } from "../domain";
import { DEMO_IMPORTED_JSON, DEMO_SCENES, DEMO_STORY } from "./seed";
import { getLibraryService } from "@/services";

// TODO: move this file to a more appropriate location

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
    "&key, storyKey, userKey, currentSceneKey, character, inventory, history, lastPlayedAt",
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
db.on("populate", async (_transaction) => {
  // Add story to builder
  await db.stories.add(DEMO_STORY);
  await db.scenes.bulkAdd(DEMO_SCENES);

  // Add story to library
  await getLibraryService().importFromJSON(DEMO_IMPORTED_JSON);
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
