import { StoryTheme } from "@/lib/storage/domain";
import {
  getDexieThemeRepository,
  ThemeRepositoryPort,
} from "./theme-repository";
import { DEFAULT_STORY_THEME } from "./story-theme";
import { getLocalRepository } from "@/repositories";

export type ThemeServicePort = {
  getTheme: (storyKey: string) => Promise<StoryTheme["theme"]>;
  /**
   * Update a story theme, or create it if it doesn't exists
   */
  updateTheme: (
    storyKey: string,
    themeConfig: StoryTheme["theme"],
  ) => Promise<void>;
};

export const _getThemeService = ({
  repository,
  touchStory,
}: {
  repository: ThemeRepositoryPort;
  touchStory: (storyKey: string) => Promise<void>;
}): ThemeServicePort => {
  return {
    getTheme: async (storyKey) => {
      const themeEntity = await repository.get(storyKey);
      return themeEntity !== null ? themeEntity.theme : DEFAULT_STORY_THEME;
    },

    updateTheme: async (storyKey, themeConfig) => {
      const theme = await repository.get(storyKey);
      if (theme) await repository.update(storyKey, { theme: themeConfig });
      else
        await repository.create({
          storyKey,
          theme: themeConfig,
        });

      await touchStory(storyKey);
    },
  };
};

export const getThemeService = () =>
  _getThemeService({
    repository: getDexieThemeRepository(),
    touchStory: (storyKey) =>
      getLocalRepository().updateStory({
        key: storyKey,
        updatedAt: new Date(),
      }),
  });
