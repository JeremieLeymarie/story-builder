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
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/design-system/primitives/tooltip";
import { Link } from "@tanstack/react-router";
import { getUserService } from "@/domains/user/user-service";
import { Badge } from "@/design-system/primitives/badge";

export const ActionsDropdown = ({
  username,
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
        <Button variant="outline" className="gap-2">
          <SettingsIcon size="18px" />
          {username}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-2">
            Synchronization <Badge variant="secondary">Coming soon</Badge>
            <Tooltip>
              <TooltipTrigger asChild>
                <CircleHelpIcon size="16px" className="hover:text-primary" />
              </TooltipTrigger>
              <TooltipContent className="max-w-75 text-xs font-normal">
                Story Builder is designed to be local-first. This means that by
                default data is only stored locally. To allow playing and
                building on multiple devices or browsers, you can manually save
                or load data from the cloud. Learn more about our method{" "}
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
          </DropdownMenuLabel>
          {/* <DropdownMenuSeparator />
          <LoadMenuItem
            load={loadRemoteData}
            onClose={() => setIsOpen(false)}
          />
          <SaveMenuItem save={saveLocalData} onClose={() => setIsOpen(false)} />
          */}
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
