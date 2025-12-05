import { StoryThemeConfig } from "../../lib/storage/domain";

const PRIMARY = "#facc15";
const PRIMARY_FOREGROUND = "#422006";

const FOREGROUND = "#0a0a0a";
const BACKGROUND = "#ffffff";

export const DEFAULT_STORY_THEME = {
  title: { color: FOREGROUND, hidden: false, size: "large" },
  action: {
    backgroundColor: PRIMARY,
    textColor: PRIMARY_FOREGROUND,
    size: "medium",
  },
  scene: {
    background: {
      color: BACKGROUND,
    },
    text: { color: FOREGROUND },
  },
} satisfies StoryThemeConfig;
