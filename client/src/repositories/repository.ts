import { Entity } from "@/lib/storage/domain";
import { getLocalRepository } from "./indexed-db-repository";
import { LocalRepositoryPort } from "./local-repository-port";
import { getRemoteAPIRepository } from "./remote-api-repository";
import {
  RemoteRepositoryPort,
  RemoteRepositoryResponse,
} from "./remote-repository-port";
import { RepositoryPort } from "./repository-port";

// This is not a repository in the strictest sense. The goal of this repository/service
// is to encapsulate all online/offline logic
// TODO: think of a way to do transactions outside of repositories
const _getRepository = ({
  localRepository,
  remoteRepository,
}: {
  localRepository: LocalRepositoryPort;
  remoteRepository: RemoteRepositoryPort;
}): RepositoryPort => {
  return {
    // TODO: Figure out a way to avoid leaking business logic in repository for transactional changes
    createStoryWithFirstScene: async (story, scene) => {
      const result = await localRepository.createStoryWithFirstScene({
        story,
        firstScene: scene,
      });

      if (result)
        ensureSync(["story"], () => {
          remoteRepository.updateOrCreateScene(result.scene);
          remoteRepository.updateOrCreateStory(result.story);
        });

      return result;
    },

    getUser: () => {
      return localRepository.getUser();
    },

    publishStory: async (scenes, story) => {
      const response = await remoteRepository.publishStory(scenes, story);

      if (response.data) {
        await localRepository.updateStory({ ...story, status: "published" });
      }

      return !!response.data;
    },

    updateStory: async (story) => {
      const result = await localRepository.updateStory(story);

      if (result) {
        ensureSync(["story"], () =>
          remoteRepository.updateOrCreateStory(story),
        );
      }

      return result;
    },
  };
};

const repository = _getRepository({
  localRepository: getLocalRepository(),
  remoteRepository: getRemoteAPIRepository(),
});

export const getRepository = () => {
  return repository;
};
