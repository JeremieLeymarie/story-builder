import { Mock, vi } from "vitest";
import { LayoutServicePort } from "./layout-service";

export type MockLayoutService = {
  [K in keyof LayoutServicePort]: Mock<LayoutServicePort[K]>;
};

export const getStubLayoutService = (): MockLayoutService => {
  return {
    computeAutoLayout: vi.fn(),
  };
};
