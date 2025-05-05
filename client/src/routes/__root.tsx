import { Toaster } from "@/design-system/primitives/toaster";
import { ThemeProvider } from "@/providers/theme-provider";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { Navbar } from "@/navbar/navbar";
import { getUserService } from "@/services";
import { useSync } from "@/navbar/hooks/use-sync";
import { Loader } from "@/design-system/components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRegisterServiceWorker } from "@/hooks/use-register-service-worker";

const queryClient = new QueryClient();

const Component = () => {
  const user = useLiveQuery(getUserService().getCurrentUser);
  const { state, load, save } = useSync();

  useRegisterServiceWorker();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <div className="relative flex h-screen w-screen flex-col overflow-x-hidden">
          <Navbar user={user} loadRemoteData={load} saveLocalData={save} />
          <div className="relative w-full flex-1">
            {state.loading ? (
              <Loader text="Loading application data..." />
            ) : (
              <Outlet />
            )}
          </div>
        </div>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export const Route = createRootRoute({
  component: Component,
});
