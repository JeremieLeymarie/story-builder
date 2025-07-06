import { Entity, Scene, Story, User } from "../lib/storage/domain";
import { db } from "../lib/storage/dexie/dexie-db";
import { LocalRepositoryPort } from "./local-repository-port";

const getUser = async () => {
  // There should always be maximum one user in local database
  return ((await db.user.toArray())?.[0] ?? null) as User | null;
};

const entityToDexieTableAdapter = (entity: Entity) => {
  const mapping = {
    story: "stories",
    scene: "scenes",
    user: "user",
    "story-progress": "storyProgresses",
  };

  return mapping[entity];
};

const indexedDBRepository: LocalRepositoryPort = {
  // STORIES

  createStory: async (story) => {
    const key = await db.stories.add(story);
    return { ...story, key } as Story;
  },

  createStoryWithFirstScene: async ({ story, firstScene }) => {
    return db.transaction("readwrite", ["stories", "scenes"], async () => {
      const storyKey = await db.stories.add({
        ...story,
        firstSceneKey: "TEMPORARY_NULL_VALUE",
      });
      const sceneKey = await db.scenes.add({ ...firstScene, storyKey });
      await db.stories.update(storyKey, { firstSceneKey: sceneKey });
      return {
        story: { ...story, firstSceneKey: sceneKey, key: storyKey } as Story,
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

  getStoriesByKeys: async (keys) => {
    return await db.stories
      .filter((story) => keys.includes(story.key))
      .toArray();
  },

  getStoriesByAuthor: async (userKey) => {
    const stories = await db.stories
      .filter((story) => story.author?.key === userKey)
      .toArray();

    return stories ?? null;
  },

  getGames: async () => {
    const user = await getUser();
    return await db.stories
      .filter((story) => story.author?.key !== user?.key)
      .toArray();
  },

  getMostRecentStoryProgress: async (userKey) => {
    const lastProgress = await db.storyProgresses
      .orderBy("lastPlayedAt")
      .filter((progress) => progress.userKey === userKey)
      .limit(1)
      .reverse()
      .first();

    return lastProgress ?? null;
  },

  updateStory: async (story) => {
    await db.stories.update(story.key, story);
    return story;
  },

  deleteStory: async (storyKey) => {
    await db.stories.delete(storyKey);
  },

  deleteStories: async (storyKeys) => {
    await db.stories.bulkDelete(storyKeys);
  },

  // SCENES

  updateFirstScene: async (storyKey, sceneKey) => {
    await db.stories.update(storyKey, {
      firstSceneKey: sceneKey,
    });
  },

  updateOrCreateScenes: async (scenes) => {
    const keys = await db.scenes.bulkPut(scenes, { allKeys: true });
    return keys;
  },

  updateScenes: async (scenes) => {
    await db.scenes.bulkUpdate(
      scenes.map(({ key, ...scene }) => ({ key, changes: scene })),
    );
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

  updatePartialScene: async (key, scene) => {
    const result = await db.scenes.update(key, scene);

    return result > 0;
  },

  getScene: async (key) => {
    return (await db.scenes.get(key)) ?? null;
  },

  getScenes: async (keys) => {
    return (await db.scenes.bulkGet(keys)).filter((s) => !!s);
  },

  getScenesByStoryKey: async (storyKeys) => {
    const predicate = Array.isArray(storyKeys)
      ? (scene: Scene) => storyKeys.includes(scene.storyKey)
      : (scene: Scene) => storyKeys === scene.storyKey;

    return await db.scenes.filter(predicate).toArray();
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

  deleteUser: async (key: string) => {
    try {
      await db.user.delete(key);
      return true;
    } catch (_) {
      return false;
    }
  },

  // STORY PROGRESS

  getStoryProgress: async (key: string) => {
    return (await db.storyProgresses.get(key)) ?? null;
  },

  getStoryProgresses: async (storyKey) => {
    const progress = await db.storyProgresses
      .filter((progress) => progress.storyKey === storyKey)
      .toArray();

    return progress;
  },

  getStoryProgressesOrderedByDate: async (userKey, storyKey) => {
    const progress = await db.storyProgresses
      .filter(
        (progress) =>
          progress.storyKey === storyKey && progress.userKey === userKey,
      )
      .sortBy("lastPlayedAt");

    return progress.reverse();
  },

  getUserStoryProgresses: async (userKey) => {
    return await db.storyProgresses
      .filter((progress) => progress.userKey === userKey)
      .toArray();
  },

  updateStoryProgress: async (storyProgress) => {
    const result = await db.storyProgresses.update(
      storyProgress.key,
      storyProgress,
    );

    return result ? storyProgress : null;
  },

  createStoryProgress: async (storyProgress) => {
    const key = await db.storyProgresses.add(storyProgress);
    return { ...storyProgress, key };
  },

  deleteStoryProgresses: async (keys) => {
    await db.storyProgresses.bulkDelete(keys);
  },

  // OTHER
  unitOfWork: (work, { mode, entities }) => {
    const tables = entities.map(entityToDexieTableAdapter);
    return db.transaction(mode ?? "readwrite", tables, work) as ReturnType<
      typeof work
    >;
  },

  deleteScenes: async (sceneKeys) => {
    await db.scenes.bulkDelete(sceneKeys);
  },
};

export const getLocalRepository = () => {
  return indexedDBRepository;
};
