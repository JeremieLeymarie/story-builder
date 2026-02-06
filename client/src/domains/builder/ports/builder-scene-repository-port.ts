import { Scene } from "@/lib/storage/domain";
import { WithoutKey } from "@/types";

export type BuilderSceneRepositoryPort = {
  get: (key: string) => Promise<Scene | null>;
  getScenesByKey: (keys: string[]) => Promise<Record<string, Scene>>;
  bulkAdd: (payload: WithoutKey<Scene>[] | Scene[]) => Promise<string[]>;
};
