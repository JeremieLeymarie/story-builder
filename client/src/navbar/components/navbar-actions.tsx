import { AuthModalForm } from "@/auth-modal-form";
import { Button } from "@/design-system/primitives";
import { User } from "@/lib/storage/domain";
import { useState } from "react";
import { ActionsDropdown } from "./actions-dropdown";
import { LogInIcon } from "lucide-react";
import { toast } from "sonner";

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

  return user ? (
    <ActionsDropdown
      username={user.username}
      saveLocalData={saveLocalData}
      loadRemoteData={loadRemoteData}
    />
  ) : (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => setIsModalOpen(true)}
      >
        <LogInIcon size="16px" />
        Log in
      </Button>
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
