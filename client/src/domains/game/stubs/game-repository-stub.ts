import { vi } from "vitest";
import { MockPort } from "@/types";
import { GameRepositoryPort } from "../game-repository";
import { getTestFactory } from "@/lib/testing/factory";

export type MockGameRepository = MockPort<GameRepositoryPort>;

const factory = getTestFactory();

export const getStubGameRepository = (): MockGameRepository => {
  return {
    deleteWiki: vi.fn(),
    getScenes: vi.fn(() => Promise.resolve([factory.scene(), factory.scene()])),
  };
};
