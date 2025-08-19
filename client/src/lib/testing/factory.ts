import { WithoutKey } from "@/types";
import { Wiki } from "../storage/domain";
import { faker } from "@faker-js/faker";

type WikiFactories = { [K in keyof WithoutKey<Wiki>]: () => Wiki[K] };

const _wikiFactories = {
  author: () => ({
    username: faker.internet.username(),
    key: faker.string.uuid(),
  }),
  createdAt: faker.date.anytime,
  image: faker.image.url,
  name: faker.book.title,
  type: () => faker.helpers.arrayElement(["imported", "created"] as const),
  description: faker.word.sample,
} satisfies WikiFactories;

export const getTestFactory = () => {
  return {
    wiki: (partial: Partial<WithoutKey<Wiki>> = {}) => {
      const wiki = Object.entries(_wikiFactories).reduce(
        (acc, [_key, generator]) => {
          const key = _key as keyof Partial<WithoutKey<Wiki>>;
          return {
            ...acc,
            [key]: key in partial ? partial[key] : generator(),
          };
        },
        {} as WithoutKey<Wiki>,
      );

      return wiki;
    },
  };
};

export type Factory = ReturnType<typeof getTestFactory>;
