import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/design-system/primitives";
import { ReactNode, useState } from "react";
import { StorySchema } from "./story-schema";
import { CreateStoryPayload } from "../hooks/use-builder-stories";
import { StoryForm } from "./story-form";
import { useStoryForm } from "../hooks/use-story-form";

type StoryFormProps = {
  onSubmit: (props: CreateStoryPayload) => void;
  trigger?: ReactNode;
  defaultValues?: StorySchema;
  title: string;
  description: string;
};

// This version of the component is uncontrolled and needs a trigger to open it
export const StoryFormDialog = (
  props: Omit<StoryFormProps, "trigger"> & { trigger: ReactNode },
) => {
  const [open, setOpen] = useState(false);

  return <ControlledStoryFormDialog {...props} open={open} setOpen={setOpen} />;
};

// This version of the component is controlled and its state can be managed from the outside
export const ControlledStoryFormDialog = ({
  onSubmit,
  trigger,
  defaultValues,
  setOpen,
  open,
  title,
  description,
}: StoryFormProps & { open: boolean; setOpen: (open: boolean) => void }) => {
  const form = useStoryForm({ defaultValues });

  const handleOpen = (open: boolean) => {
    setOpen(open);
    if (!open) form.reset();
  };

  const submit = (data: StorySchema) => {
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
        <StoryForm form={form} onSubmit={submit} />
      </DialogContent>
    </Dialog>
  );
};
