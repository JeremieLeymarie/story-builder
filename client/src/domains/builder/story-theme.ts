import z from "zod";
import {
  ACTION_BUTTON_SIZES,
  StoryThemeConfig,
  TITLE_SIZES,
} from "../../lib/storage/domain";
import { hexColorValidator } from "@/lib/validation";

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

export const gameThemeSchema = z.object({
  title: z.object({
    hidden: z.boolean(),
    size: z.enum(TITLE_SIZES),
    color: hexColorValidator,
  }),
  action: z.object({
    backgroundColor: hexColorValidator,
    textColor: hexColorValidator,
    size: z.enum(ACTION_BUTTON_SIZES),
  }),
  scene: z.object({
    background: z.object({
      color: hexColorValidator,
      image: z.url().optional().nullable(),
    }),
    text: z.object({
      color: hexColorValidator,
      backgroundColor: hexColorValidator.optional().nullable(),
    }),
  }),
});

export type ThemeEditorSchema = z.infer<typeof gameThemeSchema>;
