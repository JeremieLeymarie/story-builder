import { Toaster } from "@/design-system/primitives/toaster";
import { ThemeProvider } from "@/providers/theme-provider";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { Navbar } from "@/navbar/navbar";
import { getUserService } from "@/services";

const Component = () => {
  const user = useLiveQuery(getUserService().getCurrentUser);
  // const { state, synchronize } = useSynchronization({ user });

  // TODO: try to sync unsynchronized entities

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="flex h-screen w-screen flex-col overflow-x-hidden">
        <Navbar user={user} />
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
