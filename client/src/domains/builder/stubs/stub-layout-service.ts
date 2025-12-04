import { vi } from "vitest";
import { LayoutServicePort } from "../ports/layout-service-port";
import { MockPort } from "@/types";

export type MockLayoutService = MockPort<LayoutServicePort>;

export const getStubLayoutService = (): MockLayoutService => {
  return {
    computeAutoLayout: vi.fn(),
  };
};
