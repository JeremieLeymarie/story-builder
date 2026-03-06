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
import { BASIC_SCENE_CONTENT, BASIC_STORY } from "@/repositories/stubs/data";
import { nanoid } from "nanoid";
import {
  getStubWikiRepository,
  MockWikiRepository,
} from "@/domains/wiki/stubs/stub-wiki-repository";
import { ImportData } from "../schema";
import {
  getStubThemeRepository,
  MockThemeRepository,
} from "@/domains/builder/stubs/stub-theme-repository";
import {
  getStubCharacterRepository,
  MockCharacterRepository,
} from "@/domains/builder/stubs/stub-character-repository";
import { DEFAULT_STORY_THEME } from "@/domains/builder/story-theme";
import {
  CharacterConfiguration,
  CharacterNumericAttribute,
} from "@/lib/storage/domain";

const STORY_KEY = nanoid();
const SCENE_KEY_A = nanoid();
const SCENE_KEY_B = nanoid();
const SCENE_KEY_C = nanoid();

const DEX_ATTRIBUTE = {
  key: nanoid(),
  type: "numeric" as const,
  name: "Dexterity",
  description: "Yiplaloop",
  isEditableByPlayer: false,
  visibility: "visible",
  initialValue: 10,
} satisfies CharacterNumericAttribute;

const CHARACTER_CONFIG = {
  key: nanoid(),
  storyKey: STORY_KEY,
  attributes: { [DEX_ATTRIBUTE.key]: DEX_ATTRIBUTE },
} satisfies CharacterConfiguration;

const IMPORTED_STORY: ImportData["story"] = {
  key: STORY_KEY,
  title: "The Great Journey To The Green River",
  description: "A wonderful epic tale through the world of Penthetir. ",
  image:
    "https://b2-backblaze-stackpath.b-cdn.net/2178699/c5jpvq_12e7c09178a6a75a5979d117f779bb07ff07f8f9.jpg",
  type: "builder" as const,
  genres: ["adventure" as const, "fantasy" as const],
  creationDate: new Date(),
  firstSceneKey: SCENE_KEY_B,
  author: {
    username: "author",
    key: nanoid(),
  },
};

const BASIC_SCENE: ImportData["scenes"][number] = {
  key: SCENE_KEY_A,
  storyKey: STORY_KEY,
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

const SCENE_WITH_SIMPLE_ACTION: ImportData["scenes"][number] = {
  key: SCENE_KEY_B,
  storyKey: STORY_KEY,
  title: "Your first scene",
  content: BASIC_SCENE_CONTENT,
  actions: [
    {
      key: nanoid(),
      type: "simple",
      text: "An action that leads to a scene",
      targets: [
        {
          sceneKey: SCENE_KEY_A,
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

const SCENE_WITH_CONDITIONAL_ACTIONS: ImportData["scenes"][number] = {
  key: SCENE_KEY_C,
  storyKey: BASIC_SCENE.key,
  title: "Your first scene",
  content: BASIC_SCENE_CONTENT,
  actions: [
    {
      key: nanoid(),
      type: "conditional",
      text: "conditional-action",
      targets: [
        {
          sceneKey: SCENE_WITH_SIMPLE_ACTION.key,
          probability: 100,
        },
      ],
      condition: { type: "user-did-visit", sceneKey: BASIC_SCENE.key },
    },
  ],
  builderParams: {
    position: {
      x: 0,
      y: 0,
    },
  },
};

const importedScenes = [
  BASIC_SCENE,
  SCENE_WITH_SIMPLE_ACTION,
  SCENE_WITH_CONDITIONAL_ACTIONS,
];

const theme = DEFAULT_STORY_THEME;

const importData = {
  story: IMPORTED_STORY,
  scenes: importedScenes,
} satisfies ImportData;

const fileContent = JSON.stringify(importData);

describe("import-service", () => {
  let localRepository: MockLocalRepository;
  let wikiRepository: MockWikiRepository;
  let themeRepository: MockThemeRepository;
  let characterRepository: MockCharacterRepository;
  let importService: ImportServicePort;

  beforeEach(() => {
    localRepository = getLocalRepositoryStub();
    wikiRepository = getStubWikiRepository();
    themeRepository = getStubThemeRepository();
    characterRepository = getStubCharacterRepository();

    importService = _getImportService({
      localRepository,
      wikiRepository,
      themeRepository,
      characterRepository,
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
        data: importData,
      });
      expect(localRepository.createStory).not.toHaveBeenCalled();
    });
  });

  describe("createStory", () => {
    it("should create story (imported)", async () => {
      const result = await importService.createStory({
        story: { story: importData.story, scenes: importData.scenes },
        type: "imported",
      });

      expect(localRepository.createStory).toHaveBeenCalledWith({
        type: "imported",
        originalStoryKey: IMPORTED_STORY.key,
        title: "The Great Journey To The Green River",
        description: "A wonderful epic tale through the world of Penthetir. ",
        image:
          "https://b2-backblaze-stackpath.b-cdn.net/2178699/c5jpvq_12e7c09178a6a75a5979d117f779bb07ff07f8f9.jpg",
        genres: ["adventure" as const, "fantasy" as const],
        creationDate: IMPORTED_STORY.creationDate,
        firstSceneKey: TEMPORARY_NULL_KEY,
        author: {
          username: "author",
          key: IMPORTED_STORY.author?.key,
        },
      });

      expect(result).toStrictEqual({
        data: BASIC_STORY, // From repository stub
      });
    });

    it("should create story with anonymous author", async () => {
      const result = await importService.createStory({
        story: {
          story: { ...importData.story, author: undefined },
          scenes: importData.scenes,
        },
        type: "imported",
      });

      expect(localRepository.createStory).toHaveBeenCalledWith({
        type: "imported",
        originalStoryKey: IMPORTED_STORY.key,
        title: "The Great Journey To The Green River",
        description: "A wonderful epic tale through the world of Penthetir. ",
        image:
          "https://b2-backblaze-stackpath.b-cdn.net/2178699/c5jpvq_12e7c09178a6a75a5979d117f779bb07ff07f8f9.jpg",
        genres: ["adventure" as const, "fantasy" as const],
        creationDate: IMPORTED_STORY.creationDate,
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
          key: IMPORTED_STORY.author!.key,
          username: "bob-bidou",
          email: "bob@mail.com",
        }),
      );

      const result = await importService.createStory({
        story: { story: importData.story, scenes: importData.scenes },
        type: "builder",
      });

      expect(localRepository.createStory).toHaveBeenCalledWith({
        type: "builder",
        originalStoryKey: IMPORTED_STORY.key,
        title: "The Great Journey To The Green River",
        description: "A wonderful epic tale through the world of Penthetir. ",
        image:
          "https://b2-backblaze-stackpath.b-cdn.net/2178699/c5jpvq_12e7c09178a6a75a5979d117f779bb07ff07f8f9.jpg",
        genres: ["adventure" as const, "fantasy" as const],
        creationDate: IMPORTED_STORY.creationDate,
        firstSceneKey: TEMPORARY_NULL_KEY,
        author: {
          username: "bob-bidou",
          key: IMPORTED_STORY.author?.key,
        },
      });

      expect(result).toStrictEqual({
        data: BASIC_STORY, // From repository stub
      });
    });
  });

  describe("createScenes", () => {
    it("should produce correct bulk update payload", () => {
      const storyFromImport: ImportData = {
        story: IMPORTED_STORY,
        scenes: [
          {
            key: "old-source-scene",
            storyKey: IMPORTED_STORY.key,
            title: "Your first scene",
            content: BASIC_SCENE_CONTENT,
            actions: [
              {
                key: "action-key-a",
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
                key: "action-key-b",
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
            storyKey: IMPORTED_STORY.key,
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
              key: expect.any(String),
              type: "simple",
              text: "An action that leads to a scene",
              targets: [{ sceneKey: "new-dest-scene", probability: 100 }],
            },
            {
              key: expect.any(String),
              type: "simple",
              text: "An action that leads to another scene",
              targets: [],
            },
          ],
        },
      ]);
    });

    it("should create scenes", async () => {
      let sceneCount = 0;
      localRepository.createScene = vi.fn(() => {
        sceneCount++;
        return Promise.resolve({
          ...BASIC_SCENE,
          key: `new-scene-key-${sceneCount}`,
        });
      });

      const result = await importService.createScenes({
        story: { story: importData.story, scenes: importData.scenes },
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
        "new-scene-key-2",
      );
      expect(result).toStrictEqual({
        [importData.scenes[0]!.key]: "new-scene-key-1",
        [importData.scenes[1]!.key]: "new-scene-key-2",
        [importData.scenes[2]!.key]: "new-scene-key-3",
      });
    });
  });

  describe("createTheme", () => {
    it("should import theme with new story key", async () => {
      await importService.createTheme({
        newStoryKey: "new-story-key",
        theme,
      });

      expect(themeRepository.create).toHaveBeenCalledWith({
        storyKey: "new-story-key",
        theme,
      });
    });
  });

  describe("createCharacterConfig", () => {
    it("should import characterConfig with new story key", async () => {
      await importService.createCharacterConfig({
        newStoryKey: "new-story-key",
        characterConfig: CHARACTER_CONFIG,
      });

      expect(characterRepository.create).toHaveBeenCalledWith({
        storyKey: "new-story-key",
        attributes: CHARACTER_CONFIG.attributes,
      });
    });
  });
});
