import {
  getLocalRepositoryStub,
  MockLocalRepository,
} from "@/repositories/stubs";
import { beforeEach, expect, it, vi, describe } from "vitest";
import {
  _getImportService,
  _makeBulkSceneUpdatePayload,
  ImportServicePort,
  TEMPORARY_NULL_KEY,
} from "../import-service";
import {
  BASIC_SCENE,
  BASIC_SCENE_CONTENT,
  BASIC_STORY,
} from "@/repositories/stubs/data";
import { nanoid } from "nanoid";
import {
  getStubWikiRepository,
  MockWikiRepository,
} from "@/domains/wiki/stubs/stub-wiki-repository";
import { StoryFromImport } from "../schema";
const SCENE_KEY_A = nanoid();

describe("import-service", () => {
  let localRepository: MockLocalRepository;
  let wikiRepository: MockWikiRepository;
  let importService: ImportServicePort;

  const importedStory: StoryFromImport["story"] = {
    key: nanoid(),
    title: "The Great Journey To The Green River",
    description: "A wonderful epic tale through the world of Penthetir. ",
    image:
      "https://b2-backblaze-stackpath.b-cdn.net/2178699/c5jpvq_12e7c09178a6a75a5979d117f779bb07ff07f8f9.jpg",
    type: "builder" as const,
    genres: ["adventure" as const, "fantasy" as const],
    creationDate: new Date(),
    firstSceneKey: SCENE_KEY_A,
    author: {
      username: "author",
      key: nanoid(),
    },
  };

  const sourceSceneA: StoryFromImport["scenes"][number] = {
    key: nanoid(),
    storyKey: nanoid(),
    title: "Your second scene",
    content: BASIC_SCENE_CONTENT,
    actions: [],
    builderParams: {
      position: {
        x: 0,
        y: 0,
      },
    },
  };

  const sourceSceneB: StoryFromImport["scenes"][number] = {
    key: SCENE_KEY_A,
    storyKey: sourceSceneA.key,
    title: "Your first scene",
    content: BASIC_SCENE_CONTENT,
    actions: [
      {
        type: "simple",
        text: "An action that leads to a scene",
        targets: [
          {
            sceneKey: sourceSceneA.key,
            probability: 100,
          },
        ],
      },
    ],
    builderParams: {
      position: {
        x: 0,
        y: 0,
      },
    },
  };

  const importedScenes = [sourceSceneA, sourceSceneB];
  const fileContent = JSON.stringify({
    story: importedStory,
    scenes: importedScenes,
  });

  const parsed = {
    story: importedStory,
    scenes: importedScenes,
  };

  beforeEach(() => {
    localRepository = getLocalRepositoryStub();
    wikiRepository = getStubWikiRepository();

    importService = _getImportService({
      localRepository,
      wikiRepository,
    });

    vi.useFakeTimers();
  });

  describe("parseJSON", () => {
    it("should not create story if JSON is malformed", async () => {
      const result = importService.parseJSON(`tutu${fileContent}`);

      expect(result).toStrictEqual({
        error: "Invalid JSON format",
        isOk: false,
      });
      expect(localRepository.createStory).not.toHaveBeenCalled();
    });

    it("should not create story if format is invalid", async () => {
      const result = importService.parseJSON(
        JSON.stringify({ plouf: ["tutu"] }),
      );

      if (result.isOk) throw new Error("Result should be an error");

      expect(result.isOk).toBeFalsy();
      expect(result.error).toMatch(/^Invalid format:?/);
      expect(localRepository.createStory).not.toHaveBeenCalled();
    });

    it("should parse JSON", () => {
      const result = importService.parseJSON(fileContent);

      expect(result).toStrictEqual({
        isOk: true,
        data: parsed,
      });
      expect(localRepository.createStory).not.toHaveBeenCalled();
    });
  });

  describe("createStory", () => {
    it("should create story (imported)", async () => {
      const result = await importService.createStory({
        story: parsed,
        type: "imported",
      });

      expect(localRepository.createStory).toHaveBeenCalledWith({
        type: "imported",
        originalStoryKey: importedStory.key,
        title: "The Great Journey To The Green River",
        description: "A wonderful epic tale through the world of Penthetir. ",
        image:
          "https://b2-backblaze-stackpath.b-cdn.net/2178699/c5jpvq_12e7c09178a6a75a5979d117f779bb07ff07f8f9.jpg",
        genres: ["adventure" as const, "fantasy" as const],
        creationDate: importedStory.creationDate,
        firstSceneKey: TEMPORARY_NULL_KEY,
        author: {
          username: "author",
          key: importedStory.author?.key,
        },
      });

      expect(result).toStrictEqual({
        data: BASIC_STORY, // From repository stub
      });
    });

    it("should create story with anonymous author", async () => {
      const result = await importService.createStory({
        story: {
          story: { ...parsed.story, author: undefined },
          scenes: parsed.scenes,
        },
        type: "imported",
      });

      expect(localRepository.createStory).toHaveBeenCalledWith({
        type: "imported",
        originalStoryKey: importedStory.key,
        title: "The Great Journey To The Green River",
        description: "A wonderful epic tale through the world of Penthetir. ",
        image:
          "https://b2-backblaze-stackpath.b-cdn.net/2178699/c5jpvq_12e7c09178a6a75a5979d117f779bb07ff07f8f9.jpg",
        genres: ["adventure" as const, "fantasy" as const],
        creationDate: importedStory.creationDate,
        firstSceneKey: TEMPORARY_NULL_KEY,
        author: {
          username: "Anonymous Author",
          key: "ANONYMOUS_AUTHOR_KEY",
        },
      });

      expect(result).toStrictEqual({
        data: BASIC_STORY, // From repository stub
      });
    });

    it("should update author field when imported in the builder", async () => {
      localRepository.getUser = vi.fn(() =>
        Promise.resolve({
          key: importedStory.author!.key,
          username: "bob-bidou",
          email: "bob@mail.com",
        }),
      );

      const result = await importService.createStory({
        story: parsed,
        type: "builder",
      });

      expect(localRepository.createStory).toHaveBeenCalledWith({
        type: "builder",
        originalStoryKey: importedStory.key,
        title: "The Great Journey To The Green River",
        description: "A wonderful epic tale through the world of Penthetir. ",
        image:
          "https://b2-backblaze-stackpath.b-cdn.net/2178699/c5jpvq_12e7c09178a6a75a5979d117f779bb07ff07f8f9.jpg",
        genres: ["adventure" as const, "fantasy" as const],
        creationDate: importedStory.creationDate,
        firstSceneKey: TEMPORARY_NULL_KEY,
        author: {
          username: "bob-bidou",
          key: importedStory.author?.key,
        },
      });

      expect(result).toStrictEqual({
        data: BASIC_STORY, // From repository stub
      });
    });
  });

  describe("createScenes", () => {
    it("should produce correct bulk update payload", () => {
      const storyFromImport: StoryFromImport = {
        story: importedStory,
        scenes: [
          {
            key: "old-source-scene",
            storyKey: importedStory.key,
            title: "Your first scene",
            content: BASIC_SCENE_CONTENT,
            actions: [
              {
                text: "An action that leads to a scene",
                targets: [
                  {
                    sceneKey: "old-dest-scene",
                    probability: 100,
                  },
                ],
                type: "simple",
              },
              {
                text: "An action that leads to another scene",
                targets: [],
                type: "simple",
              },
            ],
            builderParams: {
              position: {
                x: 0,
                y: 0,
              },
            },
          },
          {
            key: "old-dest-scene",
            storyKey: importedStory.key,
            title: "title",
            content: BASIC_SCENE_CONTENT,
            actions: [],
            builderParams: {
              position: {
                x: 0,
                y: 0,
              },
            },
          },
        ],
      };

      const payload = _makeBulkSceneUpdatePayload({
        oldScenesToNewScenes: {
          "old-dest-scene": "new-dest-scene",
          "old-source-scene": "new-source-scene",
        },
        storyFromImport,
      });

      expect(payload).toStrictEqual([
        {
          key: "new-source-scene",
          actions: [
            {
              type: "simple",
              text: "An action that leads to a scene",
              targets: [{ sceneKey: "new-dest-scene", probability: 100 }],
            },
            {
              type: "simple",
              text: "An action that leads to another scene",
              targets: [],
            },
          ],
        },
      ]);
    });

    it("should create scenes", async () => {
      localRepository.createScene = vi.fn(() =>
        Promise.resolve({ ...BASIC_SCENE, key: "new-scene-key" }),
      );

      const result = await importService.createScenes({
        story: parsed,
        newStoryKey: "new-story-key",
      });

      // Scene is created with new story key & no actions at first
      expect(localRepository.createScene).toHaveBeenCalledWith({
        storyKey: "new-story-key",
        title: "Your first scene",
        content: BASIC_SCENE_CONTENT,
        actions: [],
        builderParams: {
          position: {
            x: 0,
            y: 0,
          },
        },
      });
      // Scene is updated with the new keys in the action (only the ones with a sceneKey)
      expect(localRepository.updateScenes).toHaveBeenCalledOnce();
      expect(localRepository.updateFirstScene).toHaveBeenCalledWith(
        "new-story-key",
        "new-scene-key",
      );
      expect(result).toStrictEqual({
        [parsed.scenes[0]!.key]: "new-scene-key",
        [parsed.scenes[1]!.key]: "new-scene-key",
      });
    });
  });
});
