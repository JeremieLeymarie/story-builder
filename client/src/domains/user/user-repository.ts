import { db, DexieDatabase } from "@/lib/storage/dexie/dexie-db";
import { User } from "@/lib/storage/domain";
import { TooManyUsersError } from "./errors";

export type UserRepositoryPort = {
  getCurrent: () => Promise<User | null>;
};

export const _getDexieUserRepository = (
  db: DexieDatabase,
): UserRepositoryPort => {
  return {
    getCurrent: async () => {
      const users = await db.user.toArray();
      if (users.length > 1) {
        throw new TooManyUsersError(users);
      }
      return (users?.[0] ?? null) as User | null;
    },
  };
};

export const getUserRepository = () => _getDexieUserRepository(db);
