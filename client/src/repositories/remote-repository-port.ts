import { Scene, Story, StoryProgress, User } from "@/lib/storage/domain";

export type RemoteRepositoryResponse<TData = unknown> =
  | {
      data: TData;
      error?: never;
    }
  | { data?: never; error: string };

type StandardAPIResponse = { message?: string | null; success: boolean };

export type RemoteRepositoryPort = {
  saveStory: (
    story: Story,
    scenes: Scene[],
  ) => Promise<RemoteRepositoryResponse<StandardAPIResponse>>;

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

  getSynchronizationData: (userKey: string) => Promise<
    RemoteRepositoryResponse<{
      playerGames: (Story & { scenes: Scene[] })[];
      builderGames: (Story & { scenes: Scene[] })[];
      storyProgresses: StoryProgress[];
    }>
  >;
};
