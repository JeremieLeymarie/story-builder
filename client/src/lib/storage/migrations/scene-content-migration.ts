import { db } from "../dexie/dexie-db";

export const SCENE_CONTENT_MIGRATION_KEY = "SCENE_CONTENT_MIGRATION_KEY";

export const migrate = async () => {
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
        content: makeSimpleSceneContent(scene.content),
      },
    })),
  );
};
