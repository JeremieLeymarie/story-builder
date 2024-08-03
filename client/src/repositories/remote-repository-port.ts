import { Scene, Story, User } from "@/lib/storage/domain";

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
};
