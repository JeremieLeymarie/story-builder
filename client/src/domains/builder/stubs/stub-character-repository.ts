import { MockPort } from "@/types";
import { CharacterRepositoryPort } from "../character-repository";
import { getTestFactory } from "@/lib/testing/factory";
import { vi } from "vitest";
import { nanoid } from "nanoid";

const factory = getTestFactory();
export type MockCharacterRepository = MockPort<CharacterRepositoryPort>;

export const getStubCharacterRepository = (): MockCharacterRepository => ({
  get: vi.fn(() => Promise.resolve(factory.characterConfig())),
  create: vi.fn(() => Promise.resolve(nanoid())),
  update: vi.fn(),
  delete: vi.fn(),
});
