import { vi } from "vitest";
import { WikiRepositoryPort } from "../wiki-repository";
import { WikiServiceContext } from "../wiki-service";
import { TEST_USER } from "@/lib/storage/dexie/test-db";

export const getWikiServiceTestContext = (): WikiServiceContext => ({
  userKey: TEST_USER.key,
});

export const getStubWikiRepository = (): WikiRepositoryPort => ({
  getUserWikis: vi.fn(async () => Promise.resolve([])),
});
