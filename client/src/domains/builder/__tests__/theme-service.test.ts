import { beforeEach, describe, expect, test } from "vitest";
import {
  getStubThemeRepository,
  MockThemeRepository,
} from "../stubs/stub-theme-repository";
import { _getThemeService, ThemeServicePort } from "../theme-service";
import { getTestFactory } from "@/lib/testing/factory";
import { DEFAULT_STORY_THEME } from "../story-theme";

const factory = getTestFactory();

describe("theme-service", () => {
  let repository: MockThemeRepository;
  let svc: ThemeServicePort;

  beforeEach(() => {
    repository = getStubThemeRepository();
    svc = _getThemeService({ repository });
  });

  describe("getTheme", () => {
    test("should get theme", async () => {
      const mockTheme = factory.storyTheme();
      repository.get.mockResolvedValue(mockTheme);

      const theme = await svc.getTheme(mockTheme.storyKey);

      expect(theme).toStrictEqual(mockTheme.theme);
    });

    test("should get default theme when theme does not exists yet", async () => {
      repository.get.mockResolvedValue(null);

      const theme = await svc.getTheme("plouf");

      expect(theme).toStrictEqual(DEFAULT_STORY_THEME);
    });
  });

  describe("updateTheme", () => {
    test("should create theme if not exists", async () => {
      repository.get.mockResolvedValue(null);
      const updatePayload = factory.storyTheme().theme;

      await svc.updateTheme("plouf", updatePayload);

      expect(repository.create).toHaveBeenCalledWith({
        storyKey: "plouf",
        theme: updatePayload,
      });
      expect(repository.update).not.toHaveBeenCalled();
    });

    test("should update theme if exists", async () => {
      const theme = factory.storyTheme();
      repository.get.mockResolvedValue(theme);

      const updatePayload = factory.storyTheme().theme;
      await svc.updateTheme("plouf", updatePayload);

      expect(repository.update).toHaveBeenCalledWith("plouf", {
        theme: updatePayload,
      });
      expect(repository.create).not.toHaveBeenCalled();
    });
  });
});
