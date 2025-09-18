import { User } from "@/lib/storage/domain";
import { getUserRepository, UserRepositoryPort } from "./user-repository";

export type AuthContextPort = {
  getUser: () => Promise<User | null>;
};

export const _getAuthContext = ({
  userRepository,
}: {
  userRepository: UserRepositoryPort;
}): AuthContextPort => {
  return {
    getUser: userRepository.getCurrent,
  };
};

export const getAuthContext = () => {
  return _getAuthContext({ userRepository: getUserRepository() });
};
