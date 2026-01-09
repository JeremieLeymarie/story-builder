import { User } from "@/lib/storage/domain";

export const isOnline = () => {
  return navigator.onLine;
};

export const checkCanPerformSync = (user: User | null) => {
  if (!isOnline()) {
    return { error: "Network unreachable", canSync: false };
  }

  if (!user) {
    return { error: "User not logged in", canSync: false };
  }

  return { canSync: true, error: undefined };
};
