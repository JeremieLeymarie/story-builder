import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { _getBuilderService } from "../builder";
import { getLocalRepositoryStub } from "@/repositories/stubs/local-repository-stub";
import {
  getRemoteRepositoryStub,
  stubRemoteStorageAccessors,
} from "@/repositories/stubs/remote-repository-stub";
import { LocalRepositoryPort, RemoteRepositoryPort } from "@/repositories";
import { BASE_SCENE, BASE_USER, BASE_STORY } from "./data";

describe("builder-service", () => {
  let builderService: ReturnType<typeof _getBuilderService>;
  let localRepository: LocalRepositoryPort;
  let remoteRepository: RemoteRepositoryPort;

  beforeAll(() => {
    vi.useFakeTimers();
  });

  beforeEach(() => {
    localRepository = getLocalRepositoryStub();
    remoteRepository = getRemoteRepositoryStub();

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

    it("should not create story if JSON is malformed", async () => {
      const result = await builderService.importFromJSON(`tutu${fileContent}`);

      const story = await localRepository.getStory("bloup");
      const scenes = await localRepository.getScenes("bloup");

      expect(result).toStrictEqual({ error: "Invalid JSON format" });
      expect(story).toBeNull();
      expect(scenes).toStrictEqual([]);
    });

    it("should not create story if format is invalid", async () => {
      const result = await builderService.importFromJSON(
        JSON.stringify({ stories: ["tutu"] }),
      );

      const story = await localRepository.getStory("bloup");
      const scenes = await localRepository.getScenes("bloup");

      expect(result).toStrictEqual({ error: "Story is required" });
      expect(story).toBeNull();
      expect(scenes).toStrictEqual([]);
    });
  });

  describe("addScene", () => {
    it("should add scene to local database", async () => {
      const scene = await builderService.addScene(BASE_SCENE);

      expect(scene).toStrictEqual({ ...BASE_SCENE, key: scene?.key });
    });
  });

  describe("updateStory", () => {
    it("should update story in the local database", async () => {
      const story = await localRepository.createStory(BASE_STORY);

      if (!story) throw new Error("Could not create story");

      await builderService.updateStory({
        ...story,
        title: "Pipou",
        description: "shabadada",
      });

      const updatedStory = await localRepository.getStory(story.key);

      expect(updatedStory).toStrictEqual({
        ...story,
        title: "Pipou",
        description: "shabadada",
      });
    });

    it("should add author if user is logged in", async () => {
      const story = await localRepository.createStory(BASE_STORY);
      const user = await localRepository.createUser(BASE_USER);

      if (!story) throw new Error("Could not create story");

      await builderService.updateStory({
        ...story,
        title: "Pipou",
        description: "shabadada",
      });

      const updatedStory = await localRepository.getStory(story.key);

      expect(updatedStory).toStrictEqual({
        ...story,
        title: "Pipou",
        description: "shabadada",
        author: { key: user.key, username: user.username },
      });
    });
  });

  describe("updateScene", () => {
    it("should only update specified parts of the scene", async () => {
      const scene = await localRepository.createScene(BASE_SCENE);

      await builderService.updateScene({ content: "tututu", key: scene.key });

      const updatedScene = await localRepository.getScene(scene.key);

      expect(updatedScene).toStrictEqual({
        ...scene,
        content: "tututu",
      });
    });
  });

  describe("changeFirstScene", () => {
    it("should update the first scene of a story", async () => {
      const story = await localRepository.createStory(BASE_STORY);
      if (!story) throw new Error("Could not create story");

      const scene = await localRepository.createScene({
        ...BASE_SCENE,
        storyKey: story.key,
      });

      const result = await builderService.changeFirstScene(
        story.key,
        scene.key,
      );

      const updatedStory = await localRepository.getStory(story.key);

      expect(updatedStory).toStrictEqual({
        ...story,
        firstSceneKey: scene.key,
      });
      expect(result).toBeTruthy();
    });

    it("should not update the story if the scene key is invalid", async () => {
      const story = await localRepository.createStory(BASE_STORY);
      if (!story) throw new Error("Could not create story");

      const result = await builderService.changeFirstScene(
        story.key,
        "blabloum",
      );

      const updatedStory = await localRepository.getStory(story.key);

      expect(result).toBeFalsy();
      expect(updatedStory).toStrictEqual(story);
    });

    it("should not update the story if the story key is invalid", async () => {
      const story = await localRepository.createStory(BASE_STORY);
      if (!story) throw new Error("Could not create story");

      const scene = await localRepository.createScene({
        ...BASE_SCENE,
        storyKey: story.key,
      });

      const result = await builderService.changeFirstScene(
        "zhagaga",
        scene.key,
      );

      const updatedStory = await localRepository.getStory(story.key);

      expect(result).toBeFalsy();
      expect(updatedStory).toStrictEqual(story);
    });
  });

  describe("getBuilderStoryData", () => {
    it("should return story data", async () => {
      const story = await localRepository.createStory(BASE_STORY);
      if (!story) throw new Error("Could not create story");
      const scenes = Array(10)
        .fill(1)
        .map(() => ({ ...BASE_SCENE, storyKey: story.key }));
      const sceneKeys = await localRepository.createScenes(scenes);

      const builderData = await builderService.getBuilderStoryData(story.key);

      expect(builderData.story).toStrictEqual(story);
      expect(builderData.scenes).toStrictEqual(
        scenes.map((_, i) => ({
          ...BASE_SCENE,
          storyKey: story.key,
          key: sceneKeys[i],
        })),
      );
    });

    it("should return null data when given invalid story key", async () => {
      const { story, scenes } =
        await builderService.getBuilderStoryData("ziploula");

      expect(story).toBeNull();
      expect(scenes).toStrictEqual([]);
    });
  });

  describe("getUserBuilderStories", () => {
    it("should retrieve stories created by logged in user", async () => {
      const userA = await localRepository.createUser(BASE_USER);
      const storyA = await localRepository.createStory({
        ...BASE_STORY,
        title: "haha",
        author: { username: userA.username, key: userA.key },
      });
      const storyB = await localRepository.createStory({
        ...BASE_STORY,
        title: "hihi",
      });
      await localRepository.createStory({
        ...BASE_STORY,
        title: "hihi",
        author: { username: "hey", key: "ho" },
      });

      const stories = await builderService.getUserBuilderStories();

      expect(stories).toStrictEqual([storyA, storyB]);
    });

    it("should retrieve stories created by user without account", async () => {
      const storyA = await localRepository.createStory({
        ...BASE_STORY,
        title: "haha",
      });
      const storyB = await localRepository.createStory({
        ...BASE_STORY,
        title: "hihi",
      });
      await localRepository.createStory({
        ...BASE_STORY,
        title: "hihi",
        author: { username: "hey", key: "ho" },
      });

      const stories = await builderService.getUserBuilderStories();

      expect(stories).toStrictEqual([storyA, storyB]);
    });

    it("should return an empty array when user hasn't created any stories", async () => {
      await localRepository.createUser(BASE_USER);

      await localRepository.createStory({
        ...BASE_STORY,
        title: "hihi",
        author: { username: "hey", key: "ho" },
      });

      const stories = await builderService.getUserBuilderStories();

      expect(stories).toStrictEqual([]);
    });
  });

  describe("getFullBuilderState", () => {
    it("should get all stories and scenes", async () => {
      const storiesPayload = Array(10)
        .fill(null)
        .map((_, i) => ({ ...BASE_STORY, title: `story ${i}` }));

      const stories = [];
      const scenes = [];

      for (const story of storiesPayload) {
        const s = await localRepository.createStory(story);
        if (!s) throw new Error("Could not create story");
        stories.push(s);

        const scenesPayload = Array(10)
          .fill(null)
          .map((_, i) => ({
            ...BASE_SCENE,
            storyKey: s.key,
            title: `scene ${i}`,
          }));

        for (const scene of scenesPayload) {
          const sc = await localRepository.createScene(scene);
          scenes.push(sc);
        }
      }

      const result = await builderService.getFullBuilderState();

      expect(result).toStrictEqual({ stories, scenes });
    });
  });

  describe("loadBuilderState", () => {
    it("should update local database with input data", async () => {
      const storiesPayload = Array(10)
        .fill(null)
        .map((_, i) => ({
          ...BASE_STORY,
          title: `story-${i}`,
          key: `story-key-${i}`,
        }));

      const scenesPayload = Array(10)
        .fill(null)
        .map((_, i) => ({
          ...BASE_SCENE,
          title: `scene-${i}`,
          key: `scene-key-${i}`,
          storyKey: `story-key-${i}`,
        }));

      await builderService.loadBuilderState(storiesPayload, scenesPayload);

      const storiesInDB = await localRepository.getStories();
      const scenesInDB = await localRepository.getScenes(
        storiesPayload.map(({ key }) => key),
      );

      expect(storiesInDB).toStrictEqual(storiesPayload);
      expect(scenesPayload).toStrictEqual(scenesInDB);
    });
  });
});
