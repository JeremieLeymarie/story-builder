import { MockPort } from "@/types";
import { vi } from "vitest";
import { CharacterServicePort } from "../character-service";
import { getTestFactory } from "@/lib/testing/factory";

type MockCharacterService = MockPort<CharacterServicePort>;

const factory = getTestFactory();

export const getStubCharacterService = (): MockCharacterService => ({
  getCharacter: vi.fn(() => Promise.resolve(factory.characterConfig())),
  createCharacter: vi.fn(() => Promise.resolve(factory.characterConfig())),
  addAttribute: vi.fn(() => Promise.resolve(factory.characterConfig())),
  updateAttribute: vi.fn(() => Promise.resolve(factory.characterConfig())),
  removeAttribute: vi.fn(() => Promise.resolve(factory.characterConfig())),
  deleteCharacter: vi.fn(),
});
