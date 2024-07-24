import { Scene, Story } from "@/lib/storage/domain";
import {
  RemoteRepositoryPort,
  RemoteRepositoryResponse,
} from "./remote-repository-port";

const remoteAPIRepository: RemoteRepositoryPort = {
  updatePartialScene: function (
    key: string,
    scene: Partial<Scene>,
  ): Promise<RemoteRepositoryResponse<Scene, string>> {
    throw new Error("Function not implemented.");
  },
  updateOrCreateStory: function (
    story: Story,
  ): Promise<RemoteRepositoryResponse<Story, string>> {
    throw new Error("Function not implemented.");
  },
  updateOrCreateScene: function (
    scene: Scene,
  ): Promise<RemoteRepositoryResponse<Story, string>> {
    throw new Error("Function not implemented.");
  },
};

export const getRemoteAPIRepository = () => {
  return remoteAPIRepository;
};
