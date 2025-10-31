import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/design-system/primitives";
import { ReactNode, useState } from "react";
import { CreateStoryPayload } from "../hooks/use-builder-stories";
import { CreateStoryForm } from "./create-story-form";
import { useCreateStoryForm } from "../hooks/use-create-story-form";
import { EditStorySchema } from "../hooks/use-edit-story-form";

type CreateStoryFormProps = {
  onSubmit: (props: CreateStoryPayload) => void;
  trigger?: ReactNode;
  title: string;
  description: string;
};

// This version of the component is uncontrolled and needs a trigger to open it
export const CreateStoryFormDialog = (
  props: Omit<CreateStoryFormProps, "trigger"> & { trigger: ReactNode },
) => {
  const [open, setOpen] = useState(false);

  return (
    <ControlledCreateStoryFormDialog {...props} open={open} setOpen={setOpen} />
  );
};

// This version of the component is controlled and its state can be managed from the outside
export const ControlledCreateStoryFormDialog = ({
  onSubmit,
  trigger,
  setOpen,
  open,
  title,
  description,
}: CreateStoryFormProps & {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const form = useCreateStoryForm();

  const handleOpen = (open: boolean) => {
    setOpen(open);
    if (!open) form.reset();
  };

  const submit = (data: EditStorySchema) => {
    onSubmit({ ...data });
    handleOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      {!!trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader className="p-1">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <CreateStoryForm form={form} onSubmit={submit} />
      </DialogContent>
    </Dialog>
  );
};
