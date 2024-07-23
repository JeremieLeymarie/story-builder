import { AuthModalForm } from "@/auth-modal-form";
import { Button } from "@/design-system/primitives";
import { User } from "@/lib/storage/domain";
import { useState } from "react";

export const UserDisplay = ({ user }: { user?: User | null }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return user ? (
    <div className="text-primary">{user.username}</div>
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
