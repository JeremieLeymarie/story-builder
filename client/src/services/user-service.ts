import { User } from "@/lib/storage/domain";
import {
  LocalRepositoryPort,
  RemoteRepositoryPort,
  getLocalRepository,
  getRemoteAPIRepository,
} from "@/repositories";
import { WithoutKey } from "@/types";
import { nanoid } from "nanoid";

const _getUserService = ({
  localRepository,
  remoteRepository,
}: {
  localRepository: LocalRepositoryPort;
  remoteRepository: RemoteRepositoryPort;
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

  return {
    login: async (usernameOrEmail: string, password: string) => {
      const response = await remoteRepository.login(usernameOrEmail, password);

      if (response.data) {
        _createLocalUser(response.data);
        // Side effect: once a user is logged in, update all of his or her existing stories' authorKey
        await localRepository.addAuthorToStories({
          key: response.data.key,
          username: response.data.username,
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
        const createdUser = await _createLocalUser(userData);
        // Side effect: once a user is logged in, update all of his or her existing stories' authorKey
        localRepository.addAuthorToStories({
          key: createdUser.key,
          username: createdUser.username,
        });
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
  });
