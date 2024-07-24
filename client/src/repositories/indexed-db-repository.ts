import { WithoutKey } from "@/types";
import { Scene, Story, User } from "../lib/storage/domain";
import { db } from "../lib/storage/dexie/dexie-db";
import { LocalRepositoryPort } from "./local-repository-port";

const getUser = async () => {
  // There should always be maximum one user in local database
  return ((await db.user.toArray())?.[0] ?? null) as User | null;
};

const indexedDBRepository: LocalRepositoryPort = {
  // STORIES

  createStory: async (story: Story | WithoutKey<Story>) => {
    const key = await db.stories.add(story);
    return { ...story, key };
  },

  createStoryWithFirstScene: async ({
    story,
    firstScene,
  }: {
    story: WithoutKey<Omit<Story, "firstSceneKey">>;
    firstScene: WithoutKey<Omit<Scene, "storyKey">>;
  }) => {
    return db.transaction("readwrite", ["stories", "scenes"], async () => {
      const storyKey = await db.stories.add({
        ...story,
        firstSceneKey: "TEMPORARY_NULL_VALUE",
      });
      const sceneKey = await db.scenes.add({ ...firstScene, storyKey });
      await db.stories.update(storyKey, { firstSceneKey: sceneKey });
      return {
        story: { ...story, firstSceneKey: sceneKey, key: storyKey },
        scene: { ...firstScene, storyKey, key: sceneKey },
      };
    });
  },

  updateOrCreateStories: async (stories) => {
    const keys = await db.stories.bulkPut(stories, { allKeys: true });
    return keys;
  },

  getStory: async (key) => {
    return (await db.stories.get(key)) ?? null;
  },

  getGames: async () => {
    const user = await getUser();
    return await db.stories
      .filter((story) => story.author?.key !== user?.key)
      .toArray();
  },

  getLastGamePlayed: async () => {
    const lastProgress = await db.storyProgresses
      .orderBy("lastPlayedAt")
      .limit(1)
      .reverse()
      .first();

    if (!lastProgress) return null;

    return (await db.stories.get(lastProgress.storyKey)) ?? null;
  },

  getStories: async () => {
    return await db.stories.toArray();
  },

  updateStory: async (story) => {
    await db.stories.update(story.key, story);
    return story;
  },

  // SCENES

  updateFirstScene: async (storyKey, sceneKey) => {
    await db.stories.update(storyKey, { firstSceneKey: sceneKey });
  },

  updateOrCreateScenes: async (scenes) => {
    const keys = await db.scenes.bulkPut(scenes, { allKeys: true });
    return keys;
  },

  createScene: async (scene) => {
    const key = await db.scenes.add(scene);
    return { ...scene, key };
  },

  createScenes: async (scenes) => {
    const keys = await db.scenes.bulkAdd(scenes, {
      allKeys: true,
    });
    return keys;
  },

  updateScene: async (key, scene) => {
    await db.scenes.update(key, scene);
  },

  getScene: async (key) => {
    return (await db.scenes.get(key)) ?? null;
  },

  getScenes: async (storyKey) => {
    return await db.scenes
      .filter((scene) => scene.storyKey === storyKey)
      .toArray();
  },

  addAuthorToStories: async (author) => {
    db.transaction("readwrite", "stories", async () => {
      const storiesToUpdate = (await db.stories
        .filter((story) => story.author === undefined)
        .keys()) as string[];

      const payload = storiesToUpdate.map((key) => ({
        key,
        changes: { author },
      }));

      db.stories.bulkUpdate(payload);
    });
  },

  getFinishedGameKeys: async () => {
    return (
      await db.storyProgresses
        .filter((progress) => !!progress.finished)
        .toArray()
    ).map((progress) => progress.storyKey);
  },

  updateOrCreateStoryProgresses: async (progresses) => {
    const keys = await db.storyProgresses.bulkPut(progresses, {
      allKeys: true,
    });
    return keys;
  },

  // USER

  getUser,

  getUserCount: async () => {
    return await db.user.count();
  },

  createUser: async (user) => {
    const key = await db.user.add(user);
    return { ...user, key };
  },

  updateUser: async (user) => {
    await db.user.update(user.key, user);
    return user;
  },

  // STORY PROGRESS

  getStoryProgress: async (storyKey) => {
    const progress = await db.storyProgresses
      .filter((progress) => progress.storyKey === storyKey)
      .first();

    return progress ?? null;
  },

  getStoryProgresses: async () => {
    return await db.storyProgresses.toArray();
  },

  updateStoryProgress: async (storyProgress) => {
    await db.storyProgresses.update(storyProgress.key, storyProgress);
  },

  createStoryProgress: async (storyProgress) => {
    const key = await db.storyProgresses.add(storyProgress);
    return { ...storyProgress, key };
  },
};

export const getLocalRepository = () => {
  return indexedDBRepository;
};
