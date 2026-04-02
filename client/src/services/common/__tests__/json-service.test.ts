import {
  getLocalRepositoryStub,
  MockLocalRepository,
} from "@/repositories/stubs";
import { beforeEach, expect, it, vi, describe } from "vitest";
import {
  _getJsonService,
  _makeBulkSceneUpdatePayload,
  JsonServicePort,
  TEMPORARY_NULL_KEY,
} from "../json-service";
import { BASIC_SCENE_CONTENT, BASIC_STORY } from "@/repositories/stubs/data";
import { nanoid } from "nanoid";
import {
  getStubWikiRepository,
  MockWikiRepository,
} from "@/domains/wiki/stubs/stub-wiki-repository";
import { JsonData } from "../schema";
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

const DEX_ATTRIBUTE = {
  key: nanoid(),
  type: "numeric" as const,
  name: "Dexterity",
  description: "Yiplaloop",
  visibility: "visible",
  initialValue: 10,
} satisfies CharacterNumericAttribute;

const CHARACTER_CONFIG = {
  key: nanoid(),
  storyKey: STORY_KEY,
  attributes: { [DEX_ATTRIBUTE.key]: DEX_ATTRIBUTE },
} satisfies CharacterConfiguration;

const IMPORTED_STORY: JsonData["story"] = {
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

const BASIC_SCENE: JsonData["scenes"][number] = {
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

// TODO: add probabilities
const SCENE_WITH_ACTIONS: JsonData["scenes"][number] = {
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
    {
      key: nanoid(),
      type: "conditional",
      text: "conditional-action-visit",
      targets: [
        {
          sceneKey: SCENE_KEY_A,
          probability: 100,
        },
      ],
      condition: { type: "user-did-visit", sceneKey: BASIC_SCENE.key },
    },
    {
      key: nanoid(),
      type: "conditional",
      text: "conditional-action-attribute",
      targets: [
        {
          sceneKey: SCENE_KEY_A,
          probability: 100,
        },
      ],
      condition: {
        type: "character-attribute",
        attributeKey: DEX_ATTRIBUTE.key,
        comparator: "lower-than",
        value: 10,
      },
    },
  ],
  builderParams: {
    position: {
      x: 0,
      y: 0,
    },
  },
  sideEffects: [
    {
      key: nanoid(),
      isVisible: true,
      name: "Dexterity Level Up",
      trigger: "scene-load",
      effect: {
        type: "character-attribute",
        attributeKey: DEX_ATTRIBUTE.key,
        increment: 3,
      },
    },
  ],
};

const IMPORTED_SCENES = [BASIC_SCENE, SCENE_WITH_ACTIONS];

const IMPORTED_THEME = DEFAULT_STORY_THEME;

const IMPORTED_DATA = {
  story: IMPORTED_STORY,
  scenes: IMPORTED_SCENES,
} satisfies JsonData;

const fileContent = JSON.stringify(IMPORTED_DATA);

describe("json-service", () => {
  let localRepository: MockLocalRepository;
  let wikiRepository: MockWikiRepository;
  let themeRepository: MockThemeRepository;
  let characterRepository: MockCharacterRepository;
  let jsonService: JsonServicePort;

  beforeEach(() => {
    localRepository = getLocalRepositoryStub();
    wikiRepository = getStubWikiRepository();
    themeRepository = getStubThemeRepository();
    characterRepository = getStubCharacterRepository();

    jsonService = _getJsonService({
      localRepository,
      wikiRepository,
      themeRepository,
      characterRepository,
    });

    vi.useFakeTimers();
  });

  describe("parseJSON", () => {
    it("should not create story if JSON is malformed", async () => {
      const result = jsonService.parseJSON(`tutu${fileContent}`);

      expect(result).toStrictEqual({
        error: "Invalid JSON format",
        isOk: false,
      });
      expect(localRepository.createStory).not.toHaveBeenCalled();
    });

    it("should not create story if format is invalid", async () => {
      const result = jsonService.parseJSON(JSON.stringify({ plouf: ["tutu"] }));

      if (result.isOk) throw new Error("Result should be an error");

      expect(result.isOk).toBeFalsy();
      expect(result.error).toMatch(/^Invalid format:?/);
      expect(localRepository.createStory).not.toHaveBeenCalled();
    });

    it("should parse JSON", () => {
      const result = jsonService.parseJSON(fileContent);

      expect(result).toStrictEqual({
        isOk: true,
        data: IMPORTED_DATA,
      });
      expect(localRepository.createStory).not.toHaveBeenCalled();
    });
  });

  describe("createStory", () => {
    it("should create story (imported)", async () => {
      const result = await jsonService.createStory({
        story: { story: IMPORTED_DATA.story, scenes: IMPORTED_DATA.scenes },
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
      const result = await jsonService.createStory({
        story: {
          story: { ...IMPORTED_DATA.story, author: undefined },
          scenes: IMPORTED_DATA.scenes,
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

      const result = await jsonService.createStory({
        story: { story: IMPORTED_DATA.story, scenes: IMPORTED_DATA.scenes },
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
      const payload = _makeBulkSceneUpdatePayload({
        oldScenesToNewScenes: {
          [BASIC_SCENE.key]: "new-basic-scene",
          [SCENE_WITH_ACTIONS.key]: "new-scene-with-actions",
        },
        storyFromImport: IMPORTED_DATA,
        oldCharacterAttrToNew: { [DEX_ATTRIBUTE.key]: "new-dex-key" },
      });

      // BASIC_SCENE is skipped because it doesn't need to be updated (no actions)

      expect(payload).toStrictEqual([
        {
          key: "new-scene-with-actions",
          actions: [
            {
              key: expect.any(String),
              type: "simple",
              text: "An action that leads to a scene",
              targets: [{ sceneKey: "new-basic-scene", probability: 100 }],
            },
            {
              key: expect.any(String),
              type: "conditional",
              text: "conditional-action-visit",
              targets: [{ sceneKey: "new-basic-scene", probability: 100 }],
              condition: {
                type: "user-did-visit",
                sceneKey: "new-basic-scene",
              },
            },
            {
              key: expect.any(String),
              type: "conditional",
              text: "conditional-action-attribute",
              targets: [{ sceneKey: "new-basic-scene", probability: 100 }],
              condition: {
                type: "character-attribute",
                attributeKey: "new-dex-key",
                comparator: "lower-than",
                value: 10,
              },
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

      const result = await jsonService.createScenes({
        story: { story: IMPORTED_DATA.story, scenes: IMPORTED_DATA.scenes },
        newStoryKey: "new-story-key",
        oldCharacterAttrToNew: { [DEX_ATTRIBUTE.key]: "new-dex-key" },
      });

      // Scene is created with new story key & no actions at first
      expect(localRepository.createScene).toHaveBeenNthCalledWith(2, {
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
        sideEffects: [
          {
            key: expect.any(String),
            isVisible: true,
            name: "Dexterity Level Up",
            trigger: "scene-load",
            effect: {
              type: "character-attribute",
              attributeKey: "new-dex-key",
              increment: 3,
            },
          },
        ],
      });
      // Scene is updated with the new keys in the action (only the ones with a sceneKey)
      expect(localRepository.updateScenes).toHaveBeenCalledOnce();
      expect(localRepository.updateFirstScene).toHaveBeenCalledWith(
        "new-story-key",
        "new-scene-key-2",
      );
      expect(result).toStrictEqual({
        [IMPORTED_DATA.scenes[0]!.key]: "new-scene-key-1",
        [IMPORTED_DATA.scenes[1]!.key]: "new-scene-key-2",
      });
    });
  });

  describe("createTheme", () => {
    it("should import theme with new story key", async () => {
      await jsonService.createTheme({
        newStoryKey: "new-story-key",
        theme: IMPORTED_THEME,
      });

      expect(themeRepository.create).toHaveBeenCalledWith({
        storyKey: "new-story-key",
        theme: IMPORTED_THEME,
      });
    });
  });

  describe("createCharacterConfig", () => {
    it("should import characterConfig with new story key", async () => {
      characterRepository.create = vi.fn(async (cc) => {
        expect(cc.storyKey).toStrictEqual("new-story-key");
        expect(Object.keys(cc.attributes)).toHaveLength(1);

        const [key, attr] = Object.entries(cc.attributes)[0]!;
        expect(key).not.toStrictEqual(DEX_ATTRIBUTE.key);
        expect(attr.key).not.toStrictEqual(DEX_ATTRIBUTE.key);

        return Promise.resolve("new-key");
      });

      await jsonService.createCharacterConfig({
        newStoryKey: "new-story-key",
        characterConfig: CHARACTER_CONFIG,
      });
    });
  });
});
