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

export const UserDropdown = ({
  username,
  saveLocalData,
  loadRemoteData,
}: {
  username: string;
  saveLocalData: () => void;
  loadRemoteData: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

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
            Actions {/* TODO: tooltip */}
            <CircleHelpIcon size="16px" className="hover:text-primary" />
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <LoadMenuItem
            load={loadRemoteData}
            onClose={() => setIsOpen(false)}
          />
          <SaveMenuItem save={saveLocalData} onClose={() => setIsOpen(false)} />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="gap-2">
            {/* TODO: implement logout */}
            <LogOutIcon size="16px" /> <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
