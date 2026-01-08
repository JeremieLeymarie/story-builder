import { vi } from "vitest";
import { MockPort } from "@/types";
import { GameRepositoryPort } from "../game-repository";

export type MockGameRepository = MockPort<GameRepositoryPort>;

export const getStubGameRepository = (): MockGameRepository => {
  return {
    deleteWiki: vi.fn(),
  };
};
