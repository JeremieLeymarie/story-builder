import { Scene, Story, StoryProgress, User } from "@/lib/storage/domain";

export type RemoteRepositoryResponse<TData = unknown> =
  | {
      data: TData;
      error?: never;
    }
  | { data?: never; error: string };

export type RemoteRepositoryPort = {
  updatePartialScene: (
    key: string,
    scene: Partial<Scene>,
  ) => Promise<RemoteRepositoryResponse<Scene>>;

  updateOrCreateStory: (
    story: Story,
  ) => Promise<RemoteRepositoryResponse<Story>>;

  updateOrCreateScene: (
    scene: Scene,
  ) => Promise<RemoteRepositoryResponse<Story>>;

  updateOrCreateFullStory: (
    story: Story,
    scenes: Scene[],
  ) => Promise<RemoteRepositoryResponse<{ story: Story; scenes: Scene[] }>>;

  publishStory: (
    scenes: Scene[],
    story: Story,
  ) => Promise<RemoteRepositoryResponse<Story>>;

  login: (
    usernameOrEmail: string,
    password: string,
  ) => Promise<RemoteRepositoryResponse<User>>;

  register: (
    user: User & { password: string },
  ) => Promise<RemoteRepositoryResponse<User>>;

  getStoreItems: () => Promise<RemoteRepositoryResponse<Story[]>>;

  downloadStory: (
    storyKey: string,
  ) => Promise<RemoteRepositoryResponse<{ story: Story; scenes: Scene[] }>>;

  saveStoryProgress: (
    storyProgress: StoryProgress,
    userKey: string,
  ) => Promise<RemoteRepositoryResponse<StoryProgress>>;
};
