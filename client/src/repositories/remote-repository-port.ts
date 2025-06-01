import { Scene, Story, StoryProgress, User } from "@/lib/storage/domain";

export type RemoteRepositoryResponse<TData = unknown> =
  | {
      data: TData;
      error?: never;
    }
  | { data?: never; error: string };

type StandardAPIResponse = { message?: string | null; success: boolean };

export type RemoteRepositoryPort = {
  login: (
    usernameOrEmail: string,
    password: string,
  ) => Promise<RemoteRepositoryResponse<User>>;

  register: (
    user: User & { password: string },
  ) => Promise<RemoteRepositoryResponse<User>>;

  saveStoryProgresses: (
    storyProgresses: StoryProgress[],
    user: User,
  ) => Promise<RemoteRepositoryResponse<StoryProgress[]>>;

  saveBuilderStories: (
    stories: Story[],
    scenes: Scene[],
    user: User,
  ) => Promise<RemoteRepositoryResponse<StandardAPIResponse>>;

  saveLibraryStories: (
    stories: Story[],
    scenes: Scene[],
    user: User,
  ) => Promise<RemoteRepositoryResponse<StandardAPIResponse>>;

  getSynchronizationData: (user: User) => Promise<
    RemoteRepositoryResponse<{
      playerGames: { stories: Story[]; scenes: Scene[] };
      builderGames: { stories: Story[]; scenes: Scene[] };
      storyProgresses: StoryProgress[];
    }>
  >;
};
