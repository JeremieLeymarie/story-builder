import Dexie, { type EntityTable, Table } from "dexie";
import { nanoid } from "nanoid";
import {
  User,
  Story,
  Scene,
  StoryProgress,
  Wiki,
  WikiArticle,
  WikiCategory,
  WikiArticleLink,
  Action,
  StoryTheme,
  CharacterConfiguration,
} from "../domain";
import { DEMO_IMPORTED_STORY, DEMO_SCENES, DEMO_STORY } from "./seed";
import { getLibraryService } from "@/domains/game/library-service";

type Tables = {
  user: EntityTable<User, "key">;
  stories: EntityTable<Story, "key">;
  scenes: EntityTable<Scene, "key">;
  storyThemes: EntityTable<StoryTheme, "key">;
  characterConfigurations: EntityTable<CharacterConfiguration, "key">;
  storyProgresses: EntityTable<StoryProgress, "key">;
  wikis: EntityTable<Wiki, "key">;
  wikiArticles: EntityTable<WikiArticle, "key">;
  wikiCategories: EntityTable<WikiCategory, "key">;
  wikiArticleLinks: Table<WikiArticleLink, [string, string]>;
};
export type DexieDatabase = Dexie & Tables;

export const db = new Dexie("story-builder") as DexieDatabase;

const tables: Record<keyof Tables, string> = {
  user: "&key, &username, email",
  stories:
    "&key, firstSceneKey, title, description, image, status, genres, publicationDate, creationDate, author, finished",
  scenes: "&key, storyKey, title, content, actions, builderParams",
  storyThemes: "&key, &storyKey",
  characterConfigurations: "&key, &storyKey",
  storyProgresses:
    "&key, storyKey, userKey, currentSceneKey, character, inventory, history, lastPlayedAt, createdAt",
  wikis: "&key, userKey",
  wikiArticles: "&key, wikiKey, categoryKey, title",
  wikiCategories: "&key, wikiKey, name",
  wikiArticleLinks: "[key+entityKey], key, entityKey, entityType, articleKey",
};

export const createDb = (
  db: DexieDatabase,
  { seed }: { seed: boolean } = { seed: true },
) => {
  db.version(6).stores(tables);
  // Migration: add type `simple` to actions to handle conditional actions
  db.version(7)
    .stores(tables)
    .upgrade(async () => {
      const bulkPayload: {
        key: string;
        changes: Partial<Scene>;
      }[] = [];

      await db.scenes.each((scene) => {
        const actions = scene.actions.map((action) => ({
          ...action,
          type: "simple",
        })) satisfies Action[];
        bulkPayload.push({ key: scene.key, changes: { actions } });
      });

      await db.scenes.bulkUpdate(bulkPayload);
    });

  // Migration: add probability to scene actions
  db.version(8)
    .stores(tables)
    .upgrade(async () => {
      const bulkPayload: {
        key: string;
        changes: Partial<Scene>;
      }[] = [];

      await db.scenes.each((scene) => {
        const actions = scene.actions.map((action) => ({
          ...action,
          // @ts-expect-error action.sceneKey is replaced by action.targets
          targets: action.sceneKey
            ? [
                {
                  // @ts-expect-error action.sceneKey is replaced by action.targets
                  sceneKey: action.sceneKey,
                  probability: 100,
                },
              ]
            : [],
        })) satisfies Action[];
        bulkPayload.push({ key: scene.key, changes: { actions } });
      });

      await db.scenes.bulkUpdate(bulkPayload);
    });

  // Migration: add unique key to scene actions
  db.version(9)
    .stores(tables)
    .upgrade(async () => {
      const bulkPayload: {
        key: string;
        changes: Partial<Scene>;
      }[] = [];

      await db.scenes.each((scene) => {
        const actions = scene.actions.map((action) => ({
          ...action,
          key: nanoid(),
        })) satisfies Action[];
        bulkPayload.push({ key: scene.key, changes: { actions } });
      });

      await db.scenes.bulkUpdate(bulkPayload);
    });

  if (seed)
    db.on("populate", async () => {
      // Add story to builder
      await db.stories.add(DEMO_STORY);
      await db.scenes.bulkAdd(DEMO_SCENES);

      // Add story to library
      await getLibraryService().importStory(DEMO_IMPORTED_STORY);
    });

  db.version(9)
    .stores(tables)
    .upgrade(async () => {
      const bulkPayload: { key: string; changes: Partial<StoryProgress> }[] =
        [];

      await db.storyProgresses.each((progress) => {
        if (!progress.createdAt) {
          bulkPayload.push({
            key: progress.key,
            changes: { createdAt: progress.lastPlayedAt ?? new Date() },
          });
        }
      });

      if (bulkPayload.length) {
        await db.storyProgresses.bulkUpdate(bulkPayload);
      }
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
};

createDb(db);
