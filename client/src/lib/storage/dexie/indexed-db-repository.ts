import { WithoutId } from "@/types";
import { Scene, Story, User, db } from "./dexie-db";
import { LocalRepositoryPort } from "../port";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
class IndexedDBRepository implements LocalRepositoryPort {
  async createStory(story: WithoutId<Story>) {
    const id = await db.stories.add(story);
    return { ...story, id };
  }

  async getStory(id: number) {
    return (await db.stories.get(id)) ?? null;
  }

  async getGames() {
    const user = await this.getUser();
    return await db.stories
      .filter((story) => story.authorId !== user.id)
      .toArray();
  }

  async getStories() {
    return await db.stories.toArray();
  }

  async updateStory(story: Story) {
    await db.stories.update(story.id, story);
    return story;
  }

  async updateFirstScene(storyId: number, sceneId: number) {
    await db.stories.update(storyId, { firstSceneId: sceneId });
  }

  async createScene(scene: WithoutId<Scene>) {
    const id = await db.scenes.add(scene);
    return { ...scene, id };
  }

  async createScenes(scenes: WithoutId<Scene>[]) {
    const ids = await db.scenes.bulkAdd(scenes, {
      allKeys: true,
    });
    return ids;
  }

  async updateScene(scene: Scene) {
    await db.scenes.update(scene.id, scene);
    return scene;
  }

  async getScene(id: number) {
    return (await db.scenes.get(id)) ?? null;
  }

  async getScenes(storyId: number) {
    return await db.scenes
      .filter((scene) => scene.storyId === storyId)
      .toArray();
  }

  async getUser() {
    // There should always be one user in local database
    return (await db.user.toArray())?.[0] ?? null;
  }

  async getUserCount() {
    return await db.user.count();
  }

  async createUser(user: User) {
    await db.user.add(user);
    return user;
  }

  // TODO: actually implement other methods
}

const repository = new IndexedDBRepository();
export const getLocalRepository = () => {
  return repository;
};
