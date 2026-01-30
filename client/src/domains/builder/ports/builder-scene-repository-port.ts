import { Scene } from "@/lib/storage/domain";
import { WithoutKey } from "@/types";

export type BuilderSceneRepositoryPort = {
  get: (key: string) => Promise<Scene | null>;
  bulkAdd: (payload: WithoutKey<Scene>[] | Scene[]) => Promise<string[]>;
};
