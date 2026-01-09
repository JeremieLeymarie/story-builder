/* eslint-disable react-refresh/only-export-components */
import { ThemeProvider } from "@/providers/theme-provider";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { DesktopNavbar } from "@/navbar/desktop-navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRegisterServiceWorker } from "@/hooks/use-register-service-worker";
import { TooltipProvider } from "@/design-system/primitives/tooltip";
import { Toaster } from "@/design-system/primitives/sonner";
import { getUserService } from "@/domains/user/user-service";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { MobileNavbar } from "@/navbar/mobile-navbar";
import { MigrationProvider } from "@/providers/migration-provider";
import { useSync } from "@/navbar/hooks/use-sync";
import { BackdropLoader } from "@/design-system/components";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { networkMode: "offlineFirst" },
    mutations: {
      networkMode: "offlineFirst",
    },
  },
});

const Component = () => {
  const user = useLiveQuery(getUserService().getCurrentUser);
  const isMobile = useIsMobile();

  const { state, load, save } = useSync();

  useRegisterServiceWorker();

  return (
    <TooltipProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <MigrationProvider>
            <div className="relative flex h-screen w-screen flex-col overflow-x-hidden">
              {isMobile ? (
                <MobileNavbar
                  user={user}
                  loadRemoteData={load}
                  saveLocalData={save}
                />
              ) : (
                <DesktopNavbar
                  user={user}
                  loadRemoteData={load}
                  saveLocalData={save}
                />
              )}
              <div className="relative w-full flex-1">
                {state.loading ? (
                  <BackdropLoader text="Loading application data..." />
                ) : (
                  <Outlet />
                )}
              </div>
            </div>
            <Toaster closeButton />
          </MigrationProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </TooltipProvider>
  );
};

export const Route = createRootRoute({
  component: Component,
});
