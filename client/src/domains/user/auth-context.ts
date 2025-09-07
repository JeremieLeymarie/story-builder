import { User } from "@/lib/storage/domain";
import { getUserRepository, UserRepositoryPort } from "./user-repository";

export type AuthContext = {
  getUser: () => Promise<User | null>;
};

export const _getAuthContext = ({
  userRepository,
}: {
  userRepository: UserRepositoryPort;
}): AuthContext => {
  return {
    getUser: userRepository.getCurrent,
  };
};

export const getAuthContext = () => {
  return _getAuthContext({ userRepository: getUserRepository() });
};
