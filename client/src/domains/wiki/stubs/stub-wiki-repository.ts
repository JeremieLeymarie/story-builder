import { vi } from "vitest";
import { WikiRepositoryPort } from "../wiki-repository";
import { getTestFactory } from "@/lib/testing/factory";
import { nanoid } from "nanoid";
import { faker } from "@faker-js/faker";

const factory = getTestFactory();

export const getStubWikiRepository = (): WikiRepositoryPort => ({
  getUserWikis: vi.fn(async () => Promise.resolve([])),
  bulkUpdate: vi.fn(async () => Promise.resolve()),
  create: vi.fn(async () => Promise.resolve(nanoid())),
  get: vi.fn(async () => Promise.resolve(factory.wiki())),
  getSections: vi.fn(async () =>
    Promise.resolve([
      {
        category: factory.wikiCategory(),
        articles: [{ title: faker.book.title(), key: nanoid() }],
      },
    ]),
  ),
  createArticle: vi.fn(async () => Promise.resolve(nanoid())),
  updateArticle: vi.fn(async () => Promise.resolve()),
  getArticle: vi.fn(async () => Promise.resolve(factory.wikiArticle())),
  createCategory: vi.fn(async () => Promise.resolve(nanoid())),
  deleteCategory: vi.fn(async () => Promise.resolve()),
  deleteArticlesByCategory: vi.fn(async () => Promise.resolve()),
  uncategorizeArticlesByCategory: vi.fn(async () => Promise.resolve()),
  addArticleLink: vi.fn(),
  getArticleLink: vi.fn(async () => Promise.resolve(factory.wikiArticleLink())),
  removeArticleLink: vi.fn(),
  updateArticleLink: vi.fn(),
  deleteArticle: vi.fn(async () => Promise.resolve()),
  getArticleLinksByArticle: vi.fn(async () => Promise.resolve([])),
  deleteArticleLinksByArticle: vi.fn(async () => Promise.resolve()),
});
