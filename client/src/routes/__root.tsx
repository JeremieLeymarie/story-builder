import { ModeToggle } from "@/components/mode-toggle";
import { ThemeProvider } from "@/providers/theme-provider";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="h-screen w-screen flex flex-col">
          <div className="h-[50px] flex items-center p-4">
            <ModeToggle />
          </div>
          <div className="w-full flex-1">
            <Outlet />
          </div>
        </div>
      </ThemeProvider>
      <TanStackRouterDevtools position="top-right" />
    </>
  ),
});
