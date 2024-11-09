import { ConfirmDialog } from "@/design-system/components";
import { Button } from "@/design-system/primitives";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";

export const DeleteGameButton = ({
  deleteGame,
}: {
  deleteGame: () => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <ConfirmDialog
      title="Are you sure?"
      description="Deleting a game is definitive"
      confirmLabel="Delete"
      open={isModalOpen}
      setOpen={setIsModalOpen}
      onConfirm={deleteGame}
      trigger={
        <Button variant="destructive" className="gap-2" size="sm">
          <Trash2Icon size="16px" />
          Delete
        </Button>
      }
    ></ConfirmDialog>
  );
};
