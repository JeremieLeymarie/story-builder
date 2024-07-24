import { Scene, Story, User } from "@/lib/storage/domain";
import { WithoutKey } from "@/types";

export type RepositoryPort = {
  updateScene: (key: string, scene: Partial<Scene>) => Promise<void>;

  createStoryWithFirstScene: (
    story: WithoutKey<Omit<Story, "firstSceneKey">>,
    scene: WithoutKey<Omit<Scene, "storyKey">>,
  ) => Promise<{ story: Story; scene: Scene } | null>;

  getUser: () => Promise<User | null>;
};
