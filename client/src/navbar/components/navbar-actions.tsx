import { AuthModalForm } from "@/auth-modal-form";
import { Button } from "@/design-system/primitives";
import { User } from "@/lib/storage/domain";
import { useState } from "react";
import { UserDropdown } from "./user-dropdown";

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
    <UserDropdown
      username={user.username}
      saveLocalData={saveLocalData}
      loadRemoteData={loadRemoteData}
    />
  ) : (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
        Log in
      </Button>
      <AuthModalForm
        open={isModalOpen}
        setOpen={setIsModalOpen}
        onSuccess={() => {
          setIsModalOpen(false);
        }}
        onError={() => {
          setIsModalOpen(false);
        }}
      />
    </>
  );
};
