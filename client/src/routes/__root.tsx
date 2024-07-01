import { Navbar } from "@/navbar";
import { ThemeProvider } from "@/providers/theme-provider";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="h-screen w-screen flex flex-col">
          <Navbar />
          <div className="w-full flex-1">
            <Outlet />
          </div>
        </div>
      </ThemeProvider>
    </>
  ),
});
