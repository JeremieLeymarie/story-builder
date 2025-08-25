import { db } from "./storage/dexie/dexie-db";
import { User } from "./storage/domain";

export const getUser = async () => {
  const users = await db.user.toArray();
  if (users.length > 1) {
    throw new Error(
      "There should always be at most one user in the local database",
    );
  }
  return (users?.[0] ?? null) as User | null;
};
