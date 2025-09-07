import { User } from "@/lib/storage/domain";

export class TooManyUsersError extends Error {
  constructor(users: User[]) {
    super(
      `There should always be at most one user in the local database, got ${users.length}:
       ${users.map((user) => `- KEY: ${user.key} - ${user.username}\n`)}`,
    );
  }
}
