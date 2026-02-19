import { ConfirmDialog } from "@/design-system/components";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/design-system/primitives";
import { SettingsIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useDeleteGame } from "../hooks/use-delete-game";
import { useNavigate } from "@tanstack/react-router";

export const GameDropdown = ({ gameKey }: { gameKey: string }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { deleteGame, isPending } = useDeleteGame({
    onSuccess: () => {
      navigate({ to: "/library" });
    },
  });

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="cursor-pointer">
          <SettingsIcon />
          Manage
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <ConfirmDialog
          title="Delete story?"
          description="Are you sure you want to delete this story? All your saves will be lost. This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={(e) => {
            e.preventDefault();
            deleteGame(gameKey);
          }}
          trigger={
            <DropdownMenuItem
              disabled={isPending}
              variant="destructive"
              // Prevent closing the dropdown when the dialog is open
              onSelect={(e) => e.preventDefault()}
            >
              <Trash2Icon />
              <span>Delete Game</span>
            </DropdownMenuItem>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
