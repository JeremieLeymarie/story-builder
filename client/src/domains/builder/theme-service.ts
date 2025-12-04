import { StoryTheme } from "@/lib/storage/domain";
import {
  getDexieThemeRepository,
  ThemeRepositoryPort,
} from "./theme-repository";

export type ThemeServicePort = {
  getTheme: (storyKey: string) => Promise<StoryTheme | null>;
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
}: {
  repository: ThemeRepositoryPort;
}): ThemeServicePort => {
  return {
    getTheme: repository.get,

    updateTheme: async (storyKey, themeConfig) => {
      const theme = await repository.get(storyKey);
      if (theme) await repository.update(storyKey, { theme: themeConfig });
      else
        await repository.create({
          storyKey,
          theme: themeConfig,
        });
    },
  };
};

export const getThemeService = () =>
  _getThemeService({ repository: getDexieThemeRepository() });
