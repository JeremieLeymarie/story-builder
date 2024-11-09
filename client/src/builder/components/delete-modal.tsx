import { ConfirmDialog } from "@/design-system/components";
import { Button } from "@/design-system/primitives";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";

export const DeleteModal = ({
  deleteStory,
}: {
  deleteStory: () => Promise<void>;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ConfirmDialog
        title="Are you sure?"
        description="Do want to delete this story from the builder? Deletion is definitive."
        confirmLabel="Delete"
        onConfirm={deleteStory}
        open={open}
        setOpen={setOpen}
        trigger={
          <Button variant="destructive" className="w-full gap-2">
            <Trash2Icon size="16px" />
            Delete
          </Button>
        }
      />
    </>
  );
};
