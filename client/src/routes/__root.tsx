import { Navbar } from "@/navbar";
import { Toaster } from "@/design-system/primitives/toaster";
import { ThemeProvider } from "@/providers/theme-provider";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="flex h-screen w-screen flex-col overflow-x-hidden">
          <Navbar />
          <div className="w-full flex-1">
            <Outlet />
          </div>
        </div>
        <Toaster />
      </ThemeProvider>
    </>
  ),
});
