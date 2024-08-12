import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { _getBuilderService } from "../builder";
import { getLocalRepositoryStub } from "@/repositories/stubs/local-repository-stub";
import {
  getRemoteRepositoryStub,
  stubRemoteStorageAccessors,
} from "@/repositories/stubs/remote-repository-stub";
import { Scene, Story, User } from "@/lib/storage/domain";
import { WithoutKey } from "@/types";

const localRepository = getLocalRepositoryStub();
const remoteRepository = getRemoteRepositoryStub();

const BASE_SCENE: WithoutKey<Scene> = {
  actions: [{ text: "action A" }, { text: "action B" }],
  builderParams: { position: { x: 0, y: 0 } },
  content: "pas content",
  storyKey: "zut",
  title: "flûte",
};

const BASE_STORY: WithoutKey<Story> = {
  title: "Tidididoudoum tidididoudoum",
  description: "Sacré histoire...",
  image: "http://ton-image.fr",
  status: "draft",
  firstSceneKey: "zut",
  genres: ["adventure", "children"],
  creationDate: new Date(),
};

const BASE_USER: WithoutKey<User> = {
  email: "bob@mail.com",
  username: "bob_bidou",
};

describe("builder-service", () => {
  let builderService: ReturnType<typeof _getBuilderService>;

  beforeAll(() => {
    vi.useFakeTimers();
  });

  beforeEach(() => {
    builderService = _getBuilderService({
      localRepository,
      remoteRepository,
    });
  });

  describe("updateSceneBuilderPosition", () => {
    it("should update node position", async () => {
      const scene = await localRepository.createScene(BASE_SCENE);

      await builderService.updateSceneBuilderPosition(scene.key, {
        x: 42,
        y: 42,
      });

      const updatedScene = await localRepository.getScene(scene.key);
      expect(updatedScene?.builderParams.position).toStrictEqual({
        x: 42,
        y: 42,
      });
    });
  });

  describe("addSceneConnection", () => {
    it("should add connection between scenes", async () => {
      const targetScene = await localRepository.createScene(BASE_SCENE);
      const sourceScene = await localRepository.createScene(BASE_SCENE);

      await builderService.addSceneConnection({
        sourceScene,
        destinationSceneKey: targetScene.key,
        actionIndex: 0,
      });

      const updatedScene = await localRepository.getScene(sourceScene.key);

      expect(updatedScene?.actions).toStrictEqual([
        { text: "action A", sceneKey: targetScene.key },
        { text: "action B" },
      ]);
    });

    it("should do nothing when given out of bounds index", async () => {
      const targetScene = await localRepository.createScene(BASE_SCENE);
      const sourceScene = await localRepository.createScene(BASE_SCENE);

      await builderService.addSceneConnection({
        sourceScene,
        destinationSceneKey: targetScene.key,
        actionIndex: 42,
      });

      const updatedScene = await localRepository.getScene(sourceScene.key);

      expect(updatedScene?.actions).toStrictEqual(sourceScene.actions);
    });

    it("should do nothing when given negative index", async () => {
      const targetScene = await localRepository.createScene(BASE_SCENE);
      const sourceScene = await localRepository.createScene(BASE_SCENE);

      await builderService.addSceneConnection({
        sourceScene,
        destinationSceneKey: targetScene.key,
        actionIndex: -42,
      });

      const updatedScene = await localRepository.getScene(sourceScene.key);

      expect(updatedScene?.actions).toStrictEqual(sourceScene.actions);
    });
  });

  describe("removeSceneConnection", () => {
    it("should remove connection between scenes", async () => {
      const sourceScene = await localRepository.createScene({
        ...BASE_SCENE,
        actions: [
          { text: "action A", sceneKey: "zut" },
          { text: "action B", sceneKey: "flûte" },
        ],
      });

      await builderService.removeSceneConnection({
        sourceScene,
        actionIndex: 0,
      });

      const updatedScene = await localRepository.getScene(sourceScene.key);

      expect(updatedScene?.actions).toStrictEqual([
        { text: "action A", sceneKey: undefined },
        { text: "action B", sceneKey: "flûte" },
      ]);
    });

    it("should do nothing when given out of bounds index", async () => {
      const sourceScene = await localRepository.createScene({
        ...BASE_SCENE,
        actions: [
          { text: "action A", sceneKey: "zut" },
          { text: "action B", sceneKey: "flûte" },
        ],
      });

      await builderService.removeSceneConnection({
        sourceScene,
        actionIndex: 42,
      });

      const updatedScene = await localRepository.getScene(sourceScene.key);

      expect(updatedScene?.actions).toStrictEqual([
        { text: "action A", sceneKey: "zut" },
        { text: "action B", sceneKey: "flûte" },
      ]);
    });

    it("should do nothing when given negative index", async () => {
      const sourceScene = await localRepository.createScene({
        ...BASE_SCENE,
        actions: [
          { text: "action A", sceneKey: "zut" },
          { text: "action B", sceneKey: "flûte" },
        ],
      });

      await builderService.removeSceneConnection({
        sourceScene,
        actionIndex: -42,
      });

      const updatedScene = await localRepository.getScene(sourceScene.key);

      expect(updatedScene?.actions).toStrictEqual([
        { text: "action A", sceneKey: "zut" },
        { text: "action B", sceneKey: "flûte" },
      ]);
    });
  });

  describe("createStoryWithFirstScene", () => {
    it("should create story and first scene", async () => {
      const result = await builderService.createStoryWithFirstScene({
        title: "Tidadoum dam tidididoum",
        description: "Waouh, impressionant...",
        image: "http://image.com",
        genres: ["adventure", "children"],
      });

      expect(result?.story).toStrictEqual({
        title: "Tidadoum dam tidididoum",
        description: "Waouh, impressionant...",
        image: "http://image.com",
        genres: ["adventure", "children"],
        creationDate: new Date(),
        status: "draft",
        firstSceneKey: result?.scene.key,
        key: result?.story.key,
      });

      expect(result?.scene).toStrictEqual({
        key: result?.story.firstSceneKey,
        storyKey: result?.story.key,
        builderParams: { position: { x: 0, y: 0 } },
        content: "This is a placeholder content for your first scene",
        title: "Your first scene",
        actions: [
          {
            text: "An action that leads to a scene",
          },
          {
            text: "An action that leads to another scene",
          },
        ],
      });
    });
    it("should add author if user is logged in", async () => {
      const user = await localRepository.createUser(BASE_USER);

      const result = await builderService.createStoryWithFirstScene({
        title: "Tidadoum dam tidididoum",
        description: "Waouh, impressionant...",
        image: "http://image.com",
        genres: ["adventure", "children"],
      });

      expect(result?.story).toStrictEqual({
        author: { username: user.username, key: user.key },
        title: "Tidadoum dam tidididoum",
        description: "Waouh, impressionant...",
        image: "http://image.com",
        genres: ["adventure", "children"],
        creationDate: new Date(),
        status: "draft",
        firstSceneKey: result?.scene.key,
        key: result?.story.key,
      });

      expect(result?.scene).toStrictEqual({
        key: result?.story.firstSceneKey,
        storyKey: result?.story.key,
        builderParams: { position: { x: 0, y: 0 } },
        content: "This is a placeholder content for your first scene",
        title: "Your first scene",
        actions: [
          {
            text: "An action that leads to a scene",
          },
          {
            text: "An action that leads to another scene",
          },
        ],
      });
    });
  });

  describe("publishStory", () => {
    it("should publish the story", async () => {
      const story = await localRepository.createStory(BASE_STORY);

      if (!story) throw new Error("Failed to create story in stub local repo");

      stubRemoteStorageAccessors.createStory({ ...story, scenes: [] });

      const result = await builderService.publishStory([], story);
      const updatedLocalStory = await localRepository.getStory(story.key);

      expect(result).toBeTruthy();
      expect(updatedLocalStory).toStrictEqual({
        ...BASE_STORY,
        publicationDate: new Date(),
        status: "published",
        key: updatedLocalStory?.key,
      });
    });

    it("should not update local repository if remote update failed (story does not exist)", async () => {
      const story = await localRepository.createStory(BASE_STORY);

      if (!story) throw new Error("Failed to create story in stub local repo");

      const result = await builderService.publishStory([], story);
      const updatedLocalStory = await localRepository.getStory(story.key);

      expect(result).toBeFalsy();
      expect(story).toStrictEqual(updatedLocalStory);
    });
  });

  describe("editStory", () => {
    it("should edit story", async () => {
      const story = await localRepository.createStory(BASE_STORY);

      if (!story) throw new Error("Failed to create story in stub local repo");

      await builderService.editStory({
        ...story,
        description: "yeehaaaw",
      });

      expect(await localRepository.getStory(story.key)).toStrictEqual({
        ...story,
        description: "yeehaaaw",
      });
    });

    it("should add author data if user is logged in", async () => {
      const story = await localRepository.createStory(BASE_STORY);
      const user = await localRepository.createUser(BASE_USER);

      if (!story) throw new Error("Failed to create story in stub local repo");

      await builderService.editStory({
        ...story,
        description: "yeehaaaw",
      });

      expect(await localRepository.getStory(story.key)).toStrictEqual({
        ...story,
        description: "yeehaaaw",
        author: { key: user.key, username: user.username },
      });
    });
  });

  describe("importFromJSON", () => {
    const importedStory = {
      key: "bloup",
      title: "The Great Journey To The Green River",
      description: "A wonderful epic tale through the world of Penthetir. ",
      image:
        "https://b2-backblaze-stackpath.b-cdn.net/2178699/c5jpvq_12e7c09178a6a75a5979d117f779bb07ff07f8f9.jpg",
      status: "draft" as const,
      genres: ["adventure" as const, "fantasy" as const],
      creationDate: new Date(),
      firstSceneKey: "skibidi",
    };
    const importedScenes = [
      {
        key: "skibidi",
        storyKey: "bloup",
        title: "Your first scene",
        content: "This is a placeholder content for your first scene",
        actions: [
          {
            text: "An action that leads to a scene",
            sceneKey: "jMa8IEtNg8ZCAbZaRz-yU",
          },
          {
            text: "An action that leads to another scene",
          },
        ],
        builderParams: {
          position: {
            x: 0,
            y: 0,
          },
        },
      },
    ];
    const fileContent = JSON.stringify({
      story: importedStory,
      scenes: importedScenes,
    });

    it("should import story from JSON", async () => {
      const result = await builderService.importFromJSON(fileContent);

      const story = await localRepository.getStory("bloup");
      const scenes = await localRepository.getScenes("bloup");

      expect(result).toStrictEqual({ error: null });
      expect(story).toStrictEqual(importedStory);
      expect(scenes).toStrictEqual(importedScenes);
    });

    it("should not create story or scenes if story already exists", async () => {
      await localRepository.createStory(importedStory);

      const result = await builderService.importFromJSON(fileContent);

      expect(result.error).toStrictEqual("Story or scene already exists");
    });

    it("should not create story or scenes if one of the scenes already exists", async () => {
      await localRepository.createScenes(importedScenes);

      const result = await builderService.importFromJSON(fileContent);
      const story = await localRepository.getStory("bloup");

      expect(result.error).toStrictEqual("Story or scene already exists");
      expect(story).toBeNull();
    });

    it("should not create story if JSON is malformed");

    it("should not create story if format is invalid");
  });
});
