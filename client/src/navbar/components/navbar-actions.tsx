import { Button } from "@/design-system/primitives";
import { User } from "@/lib/storage/domain";
import { useState } from "react";
import { ActionsDropdown } from "./actions-dropdown";
import { LogInIcon } from "lucide-react";
import { toast } from "sonner";
import { AuthModalForm } from "@/components/auth-modal-form";
import { useIsOnline } from "@/hooks/use-is-online";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/design-system/primitives/tooltip";

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
