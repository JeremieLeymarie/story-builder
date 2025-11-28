import { StoryThemeConfig } from "../../lib/storage/domain";

export const DEFAULT_STORY_THEME = {
  title: { color: "var(--foreground)", hidden: false, size: "medium" },
  action: {
    backgroundColor: "var(--primary)",
    textColor: "var(--primary-foreground)",
  },
  scene: {
    background: {
      color: "var(--background)",
    },
  },
} satisfies StoryThemeConfig;
