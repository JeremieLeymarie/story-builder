import { User } from "@/lib/storage/dexie/dexie-db";
import { getLocalRepository } from "@/lib/storage/dexie/indexed-db-repository";
import { WithoutKey } from "@/types";
import { useCallback } from "react";

export const useUser = () => {
  const repo = getLocalRepository();

  const persistUser = useCallback(
    async (user: WithoutKey<User>) => {
      const userCount = await repo.getUserCount();

      if (userCount > 0) {
        throw new Error(
          "There should not be more than one user in local database",
        );
      }

      const { key, username } = await repo.createUser(user);
      // Side effect: once a user is created, update all of his or her existing stories' authorKey
      await repo.addAuthorToStories({ key, username });

      return createdUser;
    },
    [repo],
  );

  return { persistUser };
};
