import { WithoutKey } from "@/types";
import { LocalRepositoryPort } from "../port";
import { Scene, Story, StoryProgress, User } from "../domain";
import { db } from "./dexie-db";

class IndexedDBRepository implements LocalRepositoryPort {
  // STORIES

  async createStory(story: Story | WithoutKey<Story>) {
    const key = await db.stories.add(story);
    return { ...story, key };
  }

  async createStoryWithFirstScene({
    story,
    firstScene,
  }: {
    story: WithoutKey<Omit<Story, "firstSceneKey">>;
    firstScene: WithoutKey<Omit<Scene, "storyKey">>;
  }) {
    return db.transaction("readwrite", ["stories", "scenes"], async () => {
      const storyKey = await db.stories.add({
        ...story,
        firstSceneKey: "TEMPORARY_NULL_VALUE",
      });
      const sceneKey = await db.scenes.add({ ...firstScene, storyKey });
      await db.stories.update(storyKey, { firstSceneKey: sceneKey });
      return { ...story, firstSceneKey: sceneKey, key: storyKey };
    });
  }

  async updateOrCreateStories(stories: Story[]) {
    const keys = await db.stories.bulkPut(stories, { allKeys: true });
    return keys;
  }

  async getStory(key: string) {
    return (await db.stories.get(key)) ?? null;
  }

  async getGames() {
    const user = await this.getUser();
    return await db.stories
      .filter((story) => story.author?.key !== user?.key)
      .toArray();
  }

  async getLastGamePlayed() {
    const lastProgress = await db.storyProgresses
      .orderBy("lastPlayedAt")
      .limit(1)
      .reverse()
      .first();

    if (!lastProgress) return null;

    return (await db.stories.get(lastProgress.storyKey)) ?? null;
  }

  async getStories() {
    return await db.stories.toArray();
  }

  async updateStory(story: Story) {
    await db.stories.update(story.key, story);
    return story;
  }

  // SCENES

  async updateFirstScene(storyKey: string, sceneKey: string) {
    await db.stories.update(storyKey, { firstSceneKey: sceneKey });
  }

  async updateOrCreateScenes(scenes: Scene[]) {
    const keys = await db.scenes.bulkPut(scenes, { allKeys: true });
    return keys;
  }

  async createScene(scene: WithoutKey<Scene>) {
    const key = await db.scenes.add(scene);
    return { ...scene, key };
  }

  async createScenes(scenes: WithoutKey<Scene>[]) {
    const keys = await db.scenes.bulkAdd(scenes, {
      allKeys: true,
    });
    return keys;
  }

  async updateScene(scene: Scene) {
    await db.scenes.update(scene.key, scene);
    return scene;
  }

  async getScene(key: string) {
    return (await db.scenes.get(key)) ?? null;
  }

  async getScenes(storyKey: string) {
    return await db.scenes
      .filter((scene) => scene.storyKey === storyKey)
      .toArray();
  }

  async addAuthorToStories(author: { key: string; username: string }) {
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
  }

  // USER

  async getUser() {
    // There should always be maximum one user in local database
    return ((await db.user.toArray())?.[0] ?? null) as User | null;
  }

  async getUserCount() {
    return await db.user.count();
  }

  async createUser(user: WithoutKey<User>) {
    const key = await db.user.add(user);
    return { ...user, key };
  }

  async updateUser(user: User) {
    await db.user.update(user.key, user);
    return user;
  }

  // STORY PROGRESS

  async getStoryProgress(storyKey: string) {
    const progress = await db.storyProgresses
      .filter((progress) => progress.storyKey === storyKey)
      .first();

    return progress ?? null;
  }

  async getStoryProgresses() {
    return await db.storyProgresses.toArray();
  }

  async updateStoryProgress(storyProgress: StoryProgress) {
    await db.storyProgresses.update(storyProgress.key, storyProgress);
    return storyProgress;
  }

  async createStoryProgress(storyProgress: WithoutKey<StoryProgress>) {
    const key = await db.storyProgresses.add(storyProgress);
    return { ...storyProgress, key };
  }
}

const repository = new IndexedDBRepository();
export const getLocalRepository = () => {
  return repository;
};
