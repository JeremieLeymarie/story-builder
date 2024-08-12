import { Scene, Story, StoryProgress, User } from "@/lib/storage/domain";

export type RemoteRepositoryResponse<TData = unknown> =
  | {
      data: TData;
      error?: never;
    }
  | { data?: never; error: string };

type StandardAPIResponse = { message?: string | null; success: boolean };

export type RemoteRepositoryPort = {
  publishStory: (
    scenes: Scene[],
    story: Story,
  ) => Promise<RemoteRepositoryResponse<{ story: Story; scenes: Scene[] }>>;

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

  saveStoryProgresses: (
    storyProgresses: StoryProgress[],
    userKey: string,
  ) => Promise<RemoteRepositoryResponse<StoryProgress[]>>;

  saveStories: (
    stories: Story[],
    scenes: Scene[],
  ) => Promise<RemoteRepositoryResponse<StandardAPIResponse>>;

  getSynchronizationData: (userKey: string) => Promise<
    RemoteRepositoryResponse<{
      playerGames: { stories: Story[]; scenes: Scene[] };
      builderGames: { stories: Story[]; scenes: Scene[] };
      storyProgresses: StoryProgress[];
    }>
  >;
};
