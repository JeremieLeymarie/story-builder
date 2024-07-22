import { User } from "@/lib/storage/dexie/dexie-db";

export const UserDisplay = ({ user }: { user?: User | null }) => {
  return user ? (
    <div className="text-primary">{user.username}</div>
  ) : (
    <div>Login</div>
  );
};
