import { User } from "@/lib/storage/dexie/dexie-db";
import { getRepository } from "@/lib/storage/dexie/indexed-db-repository";
import { useCallback } from "react";

export const useUser = () => {
  const repo = getRepository();

  const persistUser = useCallback(
    async (user: User) => {
      const userCount = await repo.getUserCount();

      if (userCount > 0) {
        throw new Error(
          "There should not be more than one user in local database"
        );
      }

      repo.createUser(user);
    },
    [repo]
  );

  return { persistUser };
};
