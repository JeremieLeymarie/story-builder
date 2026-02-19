import { Scene, StoryProgress } from "@/lib/storage/domain";

export type Save = StoryProgress & { lastScene?: Scene };
