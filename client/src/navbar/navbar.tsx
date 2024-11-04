import { Link, useRouterState } from "@tanstack/react-router";
import { Button } from "@/design-system/primitives";
import { NavbarActions } from "./components/navbar-actions";
import { User } from "@/lib/storage/domain";
import { PropsWithChildren } from "react";
import { cn } from "@/lib/style";

const NavButton = ({
  children,
  isCurrentState,
}: PropsWithChildren<{ isCurrentState: boolean }>) => {
  return (
    <Button
      variant="ghost"
      className={cn(isCurrentState && "text-primary hover:text-primary")}
    >
      {children}
    </Button>
  );
};

export const Navbar = ({
  user,
  loadRemoteData,
  saveLocalData,
}: {
  user?: User | null;
  loadRemoteData: () => void;
  saveLocalData: () => void;
}) => {
  const {
    location: { pathname },
  } = useRouterState();

  return (
    <div className="sticky top-0 z-50 flex h-[50px] items-center justify-between border-b-4 border-b-primary bg-white/85 px-4 py-6 backdrop-blur">
      <div className="flex gap-2">
        {/* TODO: Implement actual menu */}
        <Link to="/" className="block">
          <NavButton isCurrentState={pathname === "/"}>Home</NavButton>
        </Link>
        <Link to="/library" className="block">
          <NavButton isCurrentState={pathname.includes("library")}>
            Your games
          </NavButton>
        </Link>
        <Link to="/builder/stories" className="block">
          <NavButton isCurrentState={pathname.includes("builder")}>
            Builder
          </NavButton>
        </Link>
        <Link to="/about" className="block">
          <NavButton isCurrentState={pathname === "/about"}>About</NavButton>
        </Link>
      </div>
      <div className="flex items-center gap-6">
        <NavbarActions
          user={user}
          loadRemoteData={loadRemoteData}
          saveLocalData={saveLocalData}
        />
        {/* <ModeToggle /> */}
      </div>
    </div>
  );
};
