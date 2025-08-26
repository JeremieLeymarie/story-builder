import {
  BuilderStory,
  LibraryStory,
  STORY_GENRES,
  StoryBase,
  StoryProgress,
  Wiki,
} from "../storage/domain";
import { faker } from "@faker-js/faker";
import { nanoid } from "nanoid";

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

export const getTestFactory = () => {
  return {
    wiki: (partial: Partial<Wiki> = {}) => {
      return makeRandomEntity(_wikiFactory, partial);
    },

    story: {
      builder: (partial: Partial<BuilderStory> = {}) => {
        return makeRandomEntity(_builderStoryFactory, partial);
      },
      library: (partial: Partial<LibraryStory> = {}) => {
        return makeRandomEntity(_libraryStoryFactory, partial);
      },
    },

    storyProgress: (partial: Partial<StoryProgress> = {}) => {
      return makeRandomEntity(_storyProgressFactory, partial);
    },
  };
};

export type Factory = ReturnType<typeof getTestFactory>;
