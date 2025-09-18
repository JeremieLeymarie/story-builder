import { MockPort } from "@/types";
import { UserRepositoryPort } from "../user-repository";
import { vi } from "vitest";
import { getTestFactory } from "@/lib/testing/factory";

export type MockUserRepository = MockPort<UserRepositoryPort>;

const factory = getTestFactory();

export const getStubUserRepository = (): MockUserRepository => {
  return {
    getCurrent: vi.fn(() => Promise.resolve(factory.user())),
  };
};
