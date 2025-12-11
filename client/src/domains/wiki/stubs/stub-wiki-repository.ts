import { vi } from "vitest";
import { WikiRepositoryPort } from "../wiki-repository";
import { getTestFactory } from "@/lib/testing/factory";
import { nanoid } from "nanoid";
import { faker } from "@faker-js/faker";
import { MockPort } from "@/types";

const factory = getTestFactory();
export type MockWikiRepository = MockPort<WikiRepositoryPort>;

export const getStubWikiRepository = (): MockWikiRepository => ({
  getUserWikis: vi.fn(async () => Promise.resolve([])),
  getImportedWikis: vi.fn(async () => Promise.resolve([])),
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
  bulkAddArticles: vi.fn(),
  updateArticle: vi.fn(async () => Promise.resolve()),
  getArticle: vi.fn(async () => Promise.resolve(factory.wikiArticle())),
  getArticles: vi.fn(async () => Promise.resolve([])),
  removeArticle: vi.fn(),
  createCategory: vi.fn(async () => Promise.resolve(nanoid())),
  deleteCategory: vi.fn(async () => Promise.resolve()),
  deleteArticlesByCategory: vi.fn(async () => Promise.resolve()),
  uncategorizeArticlesByCategory: vi.fn(async () => Promise.resolve()),
  bulkAddCategories: vi.fn(),
  getCategories: vi.fn(async () => Promise.resolve([])),
  addArticleLink: vi.fn(),
  getArticleLink: vi.fn(async () => Promise.resolve(factory.wikiArticleLink())),
  getArticleLinksFromArticleKeys: vi.fn(async () => Promise.resolve([])),
  removeArticleLink: vi.fn(),
  updateArticleLink: vi.fn(),
  deleteArticle: vi.fn(async () => Promise.resolve()),
  getArticleLinksByArticle: vi.fn(async () => Promise.resolve([])),
  deleteArticleLinksByArticle: vi.fn(async () => Promise.resolve()),
  bulkAddArticleLinks: vi.fn(),
});
