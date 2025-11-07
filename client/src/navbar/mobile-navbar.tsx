import { Link, useRouterState } from "@tanstack/react-router";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/design-system/primitives";
import { User } from "@/lib/storage/domain";
import { PropsWithChildren, ReactNode, useState } from "react";
import { cn } from "@/lib/style";
import {
  BookMarkedIcon,
  CircleHelpIcon,
  CloudDownloadIcon,
  CloudUploadIcon,
  HomeIcon,
  InfoIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  NetworkIcon,
  ScrollTextIcon,
} from "lucide-react";
import { AuthModalForm } from "@/components/auth-modal-form";
import { toast } from "sonner";
import { Divider } from "@/design-system/components";
import { ConfirmLoadAction } from "./components/confirm-load-action";
import { ConfirmSaveAction } from "./components/confirm-save-action";
import { getUserService } from "@/domains/user/user-service";
import { useIsOnline } from "@/hooks/use-is-online";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/design-system/primitives/tooltip";

const NavButton = ({
  children,
  isCurrentState,
  icon,
}: PropsWithChildren<{ isCurrentState: boolean; icon: ReactNode }>) => {
  return (
    <SheetClose asChild>
      <Button
        variant="ghost"
        className={cn(
          "hover:text-primary flex items-center gap-2 text-lg",
          isCurrentState && "text-primary",
        )}
      >
        {icon}
        {children}
      </Button>
    </SheetClose>
  );
};

export const NavbarActions = ({
  user,
  saveLocalData,
  loadRemoteData,
}: {
  user?: User | null;
  saveLocalData: () => void;
  loadRemoteData: () => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isOnline = useIsOnline();

  return user ? (
    <div className="pl-4">
      <div className="flex items-center gap-2">
        <p className="text-lg font-semibold">Synchronization</p>
        <Popover>
          <PopoverTrigger>
            <CircleHelpIcon size="20px" className="hover:text-primary" />
          </PopoverTrigger>
          <PopoverContent>
            Story Builder is designed to be local-first. This means that by
            default data is only stored locally. To allow playing and building
            on multiple devices or browsers, you can manually save or load data
            from the cloud. Learn more about our method{" "}
            <Link to="/about" target="_blank">
              <Button variant="link" className="text-md m-0 h-max w-max p-0">
                here
              </Button>
            </Link>
            .
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-4 p-2">
        <ConfirmLoadAction
          load={loadRemoteData}
          trigger={
            <Button variant="ghost" className="flex gap-2 text-left text-lg">
              <CloudDownloadIcon size="20px" />
              Load cloud data
            </Button>
          }
        />
        <ConfirmSaveAction
          save={saveLocalData}
          trigger={
            <Button variant="ghost" className="flex gap-2 text-left text-lg">
              <CloudUploadIcon size="20px" />
              Save local data
            </Button>
          }
        />
      </div>
    </div>
  ) : (
    <div className="flex w-full flex-col items-center">
      <div className="flex flex-col items-center gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => isOnline && setIsModalOpen(true)}
                  disabled={!isOnline}
                >
                  <LogInIcon size="16px" />
                  Log in
                </Button>
              </span>
            </TooltipTrigger>
            {!isOnline && (
              <TooltipContent>
                <p>An internet connection is required to log in.</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        <p className="text-muted-foreground text-sm">
          To access synchronization features
        </p>
      </div>
      <AuthModalForm
        open={isModalOpen}
        setOpen={setIsModalOpen}
        onSuccess={() => {
          setIsModalOpen(false);
          toast.success("Welcome!", { description: "Successfully logged in!" });
        }}
        onError={() => {
          setIsModalOpen(false);
          toast.error("Authentication error", {
            description: "Please try again",
          });
        }}
      />
    </div>
  );
};

export const MobileNavbar = ({
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
    <Sheet>
      <header className="border-b-primary sticky top-0 z-50 flex h-[50px] items-center justify-between border-b-4 bg-white/85 px-4 py-6 backdrop-blur-sm">
        <SheetTrigger asChild>
          <Button size="icon" variant="ghost">
            <MenuIcon />
          </Button>
        </SheetTrigger>
      </header>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4">
          <Link to="/" className="block">
            <NavButton
              isCurrentState={pathname === "/"}
              icon={<HomeIcon size="20px" />}
            >
              Home
            </NavButton>
          </Link>
          <Link to="/library" className="block">
            <NavButton
              isCurrentState={pathname.includes("library")}
              icon={<BookMarkedIcon size="20px" />}
            >
              Your games
            </NavButton>
          </Link>
          <Link to="/builder/stories" className="block">
            <NavButton
              isCurrentState={pathname.includes("builder")}
              icon={<NetworkIcon size="20px" />}
            >
              Builder
            </NavButton>
          </Link>
          <Link to="/wikis" className="block">
            <NavButton
              isCurrentState={pathname.includes("wikis")}
              icon={<ScrollTextIcon size="20px" />}
            >
              Wikis
            </NavButton>
          </Link>
          <Link to="/about" className="block">
            <NavButton
              isCurrentState={pathname === "/about"}
              icon={<InfoIcon size="20px" />}
            >
              About
            </NavButton>
          </Link>
        </div>
        <div className="flex flex-col items-center">
          <Divider className="w-6/12" />
        </div>
        <div className="flex items-center gap-6">
          <NavbarActions
            user={user}
            loadRemoteData={loadRemoteData}
            saveLocalData={saveLocalData}
          />
        </div>
        <SheetFooter>
          <Button
            variant="outline"
            className="flex w-full gap-2"
            onClick={getUserService().logout}
          >
            <LogOutIcon size="16px" /> Logout
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
