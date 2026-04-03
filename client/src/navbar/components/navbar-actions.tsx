import { Button, DropdownMenuItem } from "@/design-system/primitives";
import { User } from "@/lib/storage/domain";
import { useState } from "react";
import { ActionsDropdown } from "./actions-dropdown";
import { CloudDownloadIcon, CloudUploadIcon, LogInIcon } from "lucide-react";
import { toast } from "sonner";
import { AuthModalForm } from "@/components/auth-modal-form";
import { useIsOnline } from "@/hooks/use-is-online";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/design-system/primitives/tooltip";
import { ConfirmLoadAction } from "./confirm-load-action";
import { ConfirmSaveAction } from "./confirm-save-action";

// @ts-expect-error Sync is temporarily disabled
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SaveMenuItem = ({
  save,
  onClose,
}: {
  save: () => void;
  onClose: () => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <DropdownMenuItem
        disabled
        onSelect={(e) => {
          e.preventDefault();
          setIsModalOpen(true);
        }}
        className="flex w-full items-center gap-2"
      >
        <CloudUploadIcon size="18px" />
        <span>Save</span>
      </DropdownMenuItem>

      <ConfirmSaveAction
        save={save}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onClose={onClose}
      />
    </>
  );
};

// @ts-expect-error Sync is temporarily disabled
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LoadMenuItem = ({
  load,
  onClose,
}: {
  load: () => void;
  onClose: () => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <DropdownMenuItem
        disabled
        onSelect={(e) => {
          e.preventDefault();
          setIsModalOpen(true);
        }}
        className="flex w-full items-center gap-2"
      >
        <CloudDownloadIcon size="18px" />
        <span>Load</span>
      </DropdownMenuItem>

      <ConfirmLoadAction
        onClose={onClose}
        load={load}
        setIsOpen={setIsModalOpen}
        isOpen={isModalOpen}
      />
    </>
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
    <ActionsDropdown
      username={user.username}
      saveLocalData={saveLocalData}
      loadRemoteData={loadRemoteData}
    />
  ) : (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                variant="outline"
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
    </>
  );
};
