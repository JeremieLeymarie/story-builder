import { describe, expect, test, vi } from "vitest";
import { _getAuthContext } from "../auth-context";
import { getStubUserRepository } from "../stubs/stub-user-repository";
import { getTestFactory } from "@/lib/testing/factory";

const userRepository = getStubUserRepository();
const factory = getTestFactory();

describe("auth-context", () => {
  describe("get user", () => {
    test("should call repository method", async () => {
      const expectedUser = factory.user();
      userRepository.getCurrent = vi.fn(() => Promise.resolve(expectedUser));
      const svc = _getAuthContext({ userRepository });

      const user = await svc.getUser();
      expect(user).toStrictEqual(expectedUser);
    });
  });
});
