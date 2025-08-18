import { User } from "@/lib/storage/domain";
import {
  LocalRepositoryPort,
  RemoteRepositoryPort,
  getLocalRepository,
  getRemoteAPIRepository,
} from "@/repositories";
import { WithoutKey } from "@/types";
import { nanoid } from "nanoid";
import { getWikiService, WikiServicePort } from "../wiki/wiki-service";

const _getUserService = ({
  localRepository,
  remoteRepository,
  wikiService,
}: {
  localRepository: LocalRepositoryPort;
  remoteRepository: RemoteRepositoryPort;
  wikiService: WikiServicePort;
}) => {
  const _createLocalUser = async (user: WithoutKey<User>) => {
    const userCount = await localRepository.getUserCount();

    if (userCount > 0) {
      throw new Error(
        "There should not be more than one user in local database",
      );
    }

    const createdUser = await localRepository.createUser(user);

    return createdUser;
  };

  const _afterAuth = async ({
    username,
    key,
  }: {
    username: string;
    key: string;
  }) => {
    // After authenticating, we need to set the author field in
    // - stories
    // - wikis
    // That had an undefined author field
    await Promise.all([
      localRepository.addAuthorToStories({ key, username }),
      wikiService.addAuthorToWikis({ key, username }),
    ]);
  };

  return {
    login: async (usernameOrEmail: string, password: string) => {
      const response = await remoteRepository.login(usernameOrEmail, password);

      if (response.data) {
        _createLocalUser(response.data);
        // Side effects
        _afterAuth({
          username: response.data.username,
          key: response.data.key,
        });
      }

      return response;
    },

    register: async (user: WithoutKey<User> & { password: string }) => {
      const { password, ...userData } = user;

      const newUser = { ...userData, key: nanoid() };

      const response = await remoteRepository.register({
        ...newUser,
        password,
      });

      if (response.data) {
        const createdUser = await _createLocalUser(response.data);
        // Side effects
        _afterAuth({ username: createdUser.username, key: createdUser.key });
      }

      return response;
    },

    logout: async () => {
      const user = await localRepository.getUser();

      if (!user) return;
      await localRepository.deleteUser(user.key);
    },

    getCurrentUser: async () => {
      return await localRepository.getUser();
    },
  };
};

export const getUserService = () =>
  _getUserService({
    localRepository: getLocalRepository(),
    remoteRepository: getRemoteAPIRepository(),
    wikiService: getWikiService(),
  });
