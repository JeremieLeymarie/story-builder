import {
  getLocalRepositoryStub,
  MockLocalRepository,
} from "@/repositories/stubs";
import { beforeEach, expect, it, vi, describe } from "vitest";
import {
  _getImportService,
  _makeBulkSceneUpdatePayload,
  ImportServicePort,
} from "../import-service";
import { BASIC_SCENE, BASIC_STORY } from "@/repositories/stubs/data";

describe("import-service", () => {
  let localRepository: MockLocalRepository;
  let importService: ImportServicePort;

  const importedStory = {
    key: "bloup",
    title: "The Great Journey To The Green River",
    description: "A wonderful epic tale through the world of Penthetir. ",
    image:
      "https://b2-backblaze-stackpath.b-cdn.net/2178699/c5jpvq_12e7c09178a6a75a5979d117f779bb07ff07f8f9.jpg",
    type: "builder" as const,
    genres: ["adventure" as const, "fantasy" as const],
    creationDate: new Date(),
    firstSceneKey: "skibidi",
    author: {
      username: "author",
      key: "author-key",
    },
  };
  const sourceScene = {
    key: "skibidi",
    storyKey: "bloup",
    title: "Your first scene",
    content: "This is a placeholder content for your first scene",
    actions: [
      {
        text: "An action that leads to a scene",
        sceneKey: "dest-scene",
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
  };
  const importedScenes = [sourceScene];
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

    importService = _getImportService({
      localRepository,
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

      expect(result).toStrictEqual({
        error: "Invalid format: Story is required",
        isOk: false,
      });
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
    it("should create story", async () => {
      const result = await importService.createStory({
        story: parsed,
        type: "builder",
      });

      expect(localRepository.createStory).toHaveBeenCalledWith({
        type: "builder",
        originalStoryKey: "bloup",
        title: "The Great Journey To The Green River",
        description: "A wonderful epic tale through the world of Penthetir. ",
        image:
          "https://b2-backblaze-stackpath.b-cdn.net/2178699/c5jpvq_12e7c09178a6a75a5979d117f779bb07ff07f8f9.jpg",
        genres: ["adventure" as const, "fantasy" as const],
        creationDate: importedStory.creationDate,
        firstSceneKey: "skibidi",
        author: {
          username: "author",
          key: "author-key",
        },
      });

      expect(result).toStrictEqual({
        data: BASIC_STORY, // From repository stub
      });
    });
  });

  describe("createScenes", () => {
    it("should produce correct bulk update payload", () => {
      const storyFromImport = {
        story: importedStory,
        scenes: [
          {
            key: "old-source-scene",
            storyKey: "bloup",
            title: "Your first scene",
            content: "This is a placeholder content for your first scene",
            actions: [
              {
                text: "An action that leads to a scene",
                sceneKey: "old-dest-scene",
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
          {
            key: "old-dest-scene",
            storyKey: "bloup",
            title: "title",
            content: "content",
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
              text: "An action that leads to a scene",
              sceneKey: "new-dest-scene",
            },
            {
              text: "An action that leads to another scene",
            },
          ],
        },
      ]);
    });

    it("should create scenes", async () => {
      localRepository.createScene = vi.fn(() => Promise.resolve(BASIC_SCENE));

      const result = await importService.createScenes({
        story: parsed,
        newStoryKey: "new-key",
      });

      // Scene is created with new story key & no actions at first
      expect(localRepository.createScene).toHaveBeenCalledWith({
        storyKey: "new-key",
        title: "Your first scene",
        content: "This is a placeholder content for your first scene",
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
      expect(result).toStrictEqual({ data: null, isOk: true });
    });
  });
});
