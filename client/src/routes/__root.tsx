import { Toaster } from "@/design-system/primitives/toaster";
import { ThemeProvider } from "@/providers/theme-provider";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useSynchronization } from "@/hooks/use-synchronization";
import { getLocalRepository } from "@/lib/storage/dexie/indexed-db-repository";
import { useLiveQuery } from "dexie-react-hooks";
import { Navbar } from "@/navbar/navbar";

const Component = () => {
  const user = useLiveQuery(getLocalRepository().getUser);
  const syncState = useSynchronization({ user });

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="flex h-screen w-screen flex-col overflow-x-hidden">
        <Navbar syncState={syncState} user={user} />
        <div className="w-full flex-1">
          <Outlet />
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  );
};

export const Route = createRootRoute({
  component: Component,
});
