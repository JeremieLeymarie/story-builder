import { BuilderStory } from "@/lib/storage/domain";
import { WithoutKey } from "@/types";

export type BuilderStoryRepositoryPort = {
  get: (key: string) => Promise<BuilderStory | null>;
  update: (
    key: string,
    story: Partial<WithoutKey<BuilderStory>>,
  ) => Promise<BuilderStory>;
};
