import { ConfirmDialog } from "@/design-system/components";
import { Button } from "@/design-system/primitives";
import { Trash2Icon } from "lucide-react";
import { ReactNode, useState } from "react";

export const DeleteStoryModal = ({
  deleteStory,
  trigger,
}: {
  deleteStory: () => Promise<void>;
  trigger?: ReactNode;
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
          trigger ?? (
            <Button
              variant="destructive"
              className="w-full justify-start gap-4"
              size="sm"
            >
              <Trash2Icon />
              Delete
            </Button>
          )
        }
      />
    </>
  );
};
