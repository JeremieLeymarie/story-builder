import {
  BuilderStory,
  LibraryStory,
  Scene,
  STORY_GENRES,
  StoryBase,
  StoryProgress,
  User,
  Wiki,
  WikiArticle,
  WikiArticleLink,
  WikiCategory,
} from "../storage/domain";
import { faker } from "@faker-js/faker";
import { nanoid } from "nanoid";
import { makeSimpleLexicalContent } from "../lexical-content";

type _EntityBase = {
  key: string;
  [k: string]: unknown;
};

type _BaseFactory<T extends _EntityBase> = {
  [K in keyof T]: () => T[K];
};

const makeRandomEntity = <T extends _EntityBase>(
  factory: _BaseFactory<T>,
  payload: Partial<T>,
) => {
  return Object.entries(factory).reduce((acc, [_key, generator]) => {
    const key = _key as keyof Partial<T>;
    return {
      ...acc,
      [key]: key in payload ? payload[key] : generator(),
    };
  }, {} as T);
};

type WikiFactory = _BaseFactory<Wiki>;
const _wikiFactory = {
  key: nanoid,
  author: () => ({
    username: faker.internet.username(),
    key: faker.string.uuid(),
  }),
  createdAt: faker.date.anytime,
  image: faker.image.url,
  name: faker.book.title,
  type: () => faker.helpers.arrayElement(["imported", "created"] as const),
  description: faker.word.sample,
} satisfies WikiFactory;

type WikiArticleFactory = _BaseFactory<WikiArticle>;
const _wikiArticleFactory = {
  key: nanoid,
  wikiKey: nanoid,
  title: faker.book.title,
  content: () => makeSimpleLexicalContent(faker.word.words(50)),
  image: faker.image.url,
  createdAt: faker.date.anytime,
  updatedAt: faker.date.anytime,
  categoryKey: nanoid,
} satisfies WikiArticleFactory;

type WikiCategoryFactory = _BaseFactory<WikiCategory>;
const _wikiCategoryFactory = {
  key: nanoid,
  wikiKey: nanoid,
  name: () =>
    faker.helpers.arrayElement(["culture", "people", "event", "geography"]),
  color: faker.color.rgb,
} satisfies WikiCategoryFactory;

type WikiArticleLinkFactory = _BaseFactory<WikiArticleLink>;
const _wikiArticleLinkFactory = {
  key: nanoid,
  articleKey: nanoid,
  entityKey: nanoid,
  entityType: () => faker.helpers.arrayElement(["scene"]),
} satisfies WikiArticleLinkFactory;

type StoryBaseFactory = _BaseFactory<StoryBase>;
const _baseStoryFactory = {
  key: nanoid,
  creationDate: faker.date.anytime,
  title: faker.book.title,
  description: faker.word.sample,
  firstSceneKey: nanoid,
  genres: () => faker.helpers.arrayElements(STORY_GENRES, 3),
  image: faker.image.url,
} satisfies StoryBaseFactory;

type BuilderStoryFactory = _BaseFactory<BuilderStory>;
const _builderStoryFactory = {
  ..._baseStoryFactory,
  type: () => "builder",
} satisfies BuilderStoryFactory;

type LibraryStoryFactory = _BaseFactory<LibraryStory>;
const _libraryStoryFactory = {
  ..._baseStoryFactory,
  type: () => "imported",
} satisfies LibraryStoryFactory;

type SceneFactory = _BaseFactory<Scene>;
const _sceneFactory = {
  key: nanoid,
  storyKey: nanoid,
  title: faker.book.title,
  content: () => makeSimpleLexicalContent(faker.word.sample(10)),
  actions: () =>
    Array(3)
      .fill(null)
      .map(() => ({
        text: faker.word.sample(),
        targets: [
          {
            sceneKey: nanoid(),
            probability: 100,
          },
        ],
        type: "simple",
      })),
  builderParams: () => ({
    position: { x: faker.number.float(), y: faker.number.float() },
  }),
} satisfies SceneFactory;

type StoryProgressFactory = _BaseFactory<StoryProgress>;
const _storyProgressFactory = {
  key: nanoid,
  currentSceneKey: nanoid,
  history: () => Array.from(Array(5), nanoid),
  lastPlayedAt: faker.date.anytime,
  storyKey: nanoid,
  userKey: nanoid,
  finished: () => Math.random() > 0.5,
} satisfies StoryProgressFactory;

type UserFactory = _BaseFactory<User>;
const _userFactory = {
  key: nanoid,
  email: faker.internet.email,
  username: faker.internet.username,
  token: faker.string.sample,
} satisfies UserFactory;

export const getTestFactory = () => {
  return {
    wiki: (partial: Partial<Wiki> = {}) => {
      return makeRandomEntity(_wikiFactory, partial);
    },

    wikiArticle: (partial: Partial<WikiArticle> = {}) => {
      return makeRandomEntity(_wikiArticleFactory, partial);
    },

    wikiCategory: (partial: Partial<WikiCategory> = {}) => {
      return makeRandomEntity(_wikiCategoryFactory, partial);
    },

    wikiArticleLink: (partial: Partial<WikiArticleLink> = {}) => {
      return makeRandomEntity(_wikiArticleLinkFactory, partial);
    },

    story: {
      builder: (partial: Partial<BuilderStory> = {}) => {
        return makeRandomEntity(_builderStoryFactory, partial);
      },
      library: (partial: Partial<LibraryStory> = {}) => {
        return makeRandomEntity(_libraryStoryFactory, partial);
      },
    },

    scene: (partial: Partial<Scene> = {}) => {
      return makeRandomEntity(_sceneFactory, partial);
    },

    storyProgress: (partial: Partial<StoryProgress> = {}) => {
      return makeRandomEntity(_storyProgressFactory, partial);
    },

    user: (partial: Partial<User> = {}) => {
      return makeRandomEntity(_userFactory, partial);
    },
  };
};

export type Factory = ReturnType<typeof getTestFactory>;
