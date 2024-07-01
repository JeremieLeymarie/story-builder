import { WithoutId } from "@/types";
import { Scene, Story, db } from "./dexie-db";
import { IndexedDBRepositoryPort } from "./port";

// TODO: implement missing methods
class IndexedDBRepository implements IndexedDBRepositoryPort {
  async createStory(story: WithoutId<Story>) {
    const id = await db.stories.add(story);
    return { ...story, id };
  }

  async getStory(id: number) {
    return (await db.stories.get(id)) ?? null;
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

  async updateScene(scene: Scene) {
    await db.scenes.update(scene.id, scene);
    return scene;
  }

  async getScenes(storyId: number) {
    return await db.scenes
      .filter((scene) => scene.storyId === storyId)
      .toArray();
  }

  // TODO: actually implement other methods
}

const repository = new IndexedDBRepository();
export const getRepository = () => {
  return repository;
};
