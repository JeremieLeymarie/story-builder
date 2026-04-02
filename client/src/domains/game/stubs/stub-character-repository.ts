import { MockPort } from "@/types";
import { CharacterRepositoryPort } from "../character-repository";
import { getTestFactory } from "@/lib/testing/factory";
import { vi } from "vitest";

const factory = getTestFactory();
export type MockCharacterRepository = MockPort<CharacterRepositoryPort>;

export const getStubCharacterRepository = (): MockCharacterRepository => ({
  getConfig: vi.fn(() => Promise.resolve(factory.characterConfig())),
});
