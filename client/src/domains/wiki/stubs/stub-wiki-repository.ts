import { vi } from "vitest";
import { WikiRepositoryPort } from "../wiki-repository";
import { WikiServiceContext } from "../wiki-service";
import { TEST_USER } from "@/lib/storage/dexie/test-db";
import { getTestFactory } from "@/lib/testing/factory";
import { nanoid } from "nanoid";

export const getWikiServiceTestContext = (): WikiServiceContext => ({
  getUser: () => Promise.resolve(TEST_USER),
});

const factory = getTestFactory();

export const getStubWikiRepository = (): WikiRepositoryPort => ({
  getUserWikis: vi.fn(async () => Promise.resolve([])),
  bulkUpdate: vi.fn(async () => Promise.resolve()),
  create: vi.fn(async () => Promise.resolve("KEY")),
  get: vi.fn(async () => Promise.resolve({ ...factory.wiki(), key: "KEY" })),
  createArticle: vi.fn(async () => Promise.resolve(nanoid())),
});
