import { makeSimpleLexicalContent } from "@/lib/lexical-content";
import { db } from "../dexie/dexie-db";
import { Migration } from "./types";

const SCENE_CONTENT_MIGRATION_KEY = "SCENE_CONTENT_MIGRATION_KEY";

const migrate = async () => {
  const stories = (await db.stories.toArray()).map((s) => s.key);

  const scenes = await db.scenes
    .filter(
      (scene) =>
        typeof scene.content === "string" && stories.includes(scene.storyKey),
    )
    .toArray();

  await db.scenes.bulkUpdate(
    scenes.map((scene) => ({
      key: scene.key,
      changes: {
        content: makeSimpleLexicalContent(scene.content as unknown as string),
      },
    })),
  );
};

export const SceneContentMigration: Migration = {
  key: SCENE_CONTENT_MIGRATION_KEY,
  migrate,
};
