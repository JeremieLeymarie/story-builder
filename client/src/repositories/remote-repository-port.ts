import { Scene, Story } from "@/lib/storage/domain";

export type RemoteRepositoryResponse<TData = unknown, TErr = unknown> =
  | {
      data: TData;
      error?: never;
    }
  | { data?: never; error: TErr };

export type RemoteRepositoryPort = {
  updatePartialScene: (
    key: string,
    scene: Partial<Scene>,
  ) => Promise<RemoteRepositoryResponse<Scene, string>>;

  updateOrCreateStory: (
    story: Story,
  ) => Promise<RemoteRepositoryResponse<Story, string>>;

  updateOrCreateScene: (
    scene: Scene,
  ) => Promise<RemoteRepositoryResponse<Story, string>>;
};
