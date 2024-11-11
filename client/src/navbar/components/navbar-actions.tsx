import { AuthModalForm } from "@/auth-modal-form";
import { Button, useToast } from "@/design-system/primitives";
import { User } from "@/lib/storage/domain";
import { useState } from "react";
import { ActionsDropdown } from "./actions-dropdown";
import { LogInIcon } from "lucide-react";

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
  const { toast } = useToast();

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
          toast({
            title: "Welcome!",
            description: "Successfully logged in!",
          });
        }}
        onError={() => {
          setIsModalOpen(false);
          toast({
            title: "Authentication error",
            description: "Please try again",
            variant: "destructive",
          });
        }}
      />
    </>
  );
};
