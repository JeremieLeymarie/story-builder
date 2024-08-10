import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/design-system/primitives";
import { CircleHelpIcon, LogOutIcon, SettingsIcon } from "lucide-react";
import { LoadMenuItem } from "./load-menu-item";
import { useState } from "react";
import { SaveMenuItem } from "./save-menu-item";
import { getUserService } from "@/services";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/design-system/primitives/tooltip";
import { Link } from "@tanstack/react-router";

export const ActionsDropdown = ({
  username,
  saveLocalData,
  loadRemoteData,
}: {
  username: string;
  saveLocalData: () => void;
  loadRemoteData: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const userService = getUserService();

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <SettingsIcon size="18px" />
          {username}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-2">
            Actions
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <CircleHelpIcon size="16px" className="hover:text-primary" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px] text-xs font-normal text-muted-foreground">
                  Story Builder is designed to be local-first. This means that
                  by default data is only stored locally. To allow playing and
                  building on multiple devices or browsers, you can manually
                  save or load data from the cloud. Learn more about our method{" "}
                  <Link to="/about" target="_blank">
                    <Button
                      variant="link"
                      className="m-0 h-max w-max p-0 text-xs"
                    >
                      here
                    </Button>
                  </Link>
                  .
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* TODO: implement shortcuts */}
          <LoadMenuItem
            load={loadRemoteData}
            closeMenu={() => setIsOpen(false)}
          />
          <SaveMenuItem
            save={saveLocalData}
            closeMenu={() => setIsOpen(false)}
          />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="gap-2" onClick={userService.logout}>
            <LogOutIcon size="16px" /> <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
