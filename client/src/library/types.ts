import { Scene, StoryProgress } from "@/lib/storage/domain";

export type ExtendedProgress = StoryProgress & { lastScene?: Scene };
