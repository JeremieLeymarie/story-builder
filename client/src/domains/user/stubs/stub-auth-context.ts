import { MockPort } from "@/types";
import { vi } from "vitest";
import { getTestFactory } from "@/lib/testing/factory";
import { AuthContextPort } from "../auth-context";
import { User } from "@/lib/storage/domain";

export type MockAuthContext = MockPort<AuthContextPort>;

const factory = getTestFactory();

export const getStubAuthContext = (currentUser?: User): MockAuthContext => {
  return {
    getUser: vi.fn(() => Promise.resolve(currentUser ?? factory.user())),
  };
};
