import { vi } from "vitest";
import { WikiRepositoryPort } from "../wiki-repository";
import { WikiServiceContext } from "../wiki-service";
import { TEST_USER } from "@/lib/storage/dexie/test-db";
import { getTestFactory } from "@/lib/testing/factory";
import { nanoid } from "nanoid";
import { faker } from "@faker-js/faker";

export const getWikiServiceTestContext = (): WikiServiceContext => ({
  getUser: () => Promise.resolve(TEST_USER),
});

const factory = getTestFactory();

export const getStubWikiRepository = (): WikiRepositoryPort => ({
  getUserWikis: vi.fn(async () => Promise.resolve([])),
  bulkUpdate: vi.fn(async () => Promise.resolve()),
  create: vi.fn(async () => Promise.resolve(nanoid())),
  get: vi.fn(async () =>
    Promise.resolve({
      wiki: factory.wiki(),
      sections: [
        {
          category: factory.wikiCategory(),
          articles: [{ title: faker.book.title(), key: nanoid() }],
        },
      ],
    }),
  ),
  createArticle: vi.fn(async () => Promise.resolve(nanoid())),
  updateArticle: vi.fn(async () => Promise.resolve()),
  getArticle: vi.fn(async () => Promise.resolve(factory.wikiArticle())),
});
