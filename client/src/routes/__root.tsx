import { ModeToggle } from "@/components/mode-toggle";
import { ThemeProvider } from "@/providers/theme-provider";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="p-4">
          <ModeToggle />
          <Outlet />
        </div>
      </ThemeProvider>
      <TanStackRouterDevtools />
    </>
  ),
});
