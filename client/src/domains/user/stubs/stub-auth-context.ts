import { MockPort } from "@/types";
import { vi } from "vitest";
import { getTestFactory } from "@/lib/testing/factory";
import { AuthContext } from "../auth-context";

export type MockAuthContext = MockPort<AuthContext>;

const factory = getTestFactory();

export const getStubAuthContext = (): MockAuthContext => {
  return {
    getUser: vi.fn(() => Promise.resolve(factory.user())),
  };
};
