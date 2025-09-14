import { Scene } from "@/lib/storage/domain";
import { WithoutKey } from "@/types";

export type BuilderSceneRepositoryPort = {
  bulkAdd: (payload: WithoutKey<Scene>[] | Scene[]) => Promise<string[]>;
};
