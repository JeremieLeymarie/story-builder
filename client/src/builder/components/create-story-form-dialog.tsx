import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/design-system/primitives";
import { ReactNode, useState } from "react";
import { CreateStoryForm } from "./create-story-form";
import {
  CreateStorySchemaOutput,
  useCreateStoryForm,
} from "../hooks/use-create-story-form";
import { useIsMobile } from "@/hooks/use-is-mobile";

type CreateStoryFormProps = {
  onSubmit: (props: CreateStorySchemaOutput) => void;
  trigger?: ReactNode;
  title: string;
  description: string;
  isLoading?: boolean;
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
const ControlledCreateStoryFormDialog = ({
  onSubmit,
  trigger,
  setOpen,
  open,
  title,
  description,
  isLoading,
}: CreateStoryFormProps & {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { form, submit } = useCreateStoryForm({ onSubmit });
  const isMobile = useIsMobile();

  const handleOpen = (open: boolean) => {
    setOpen(open);
    if (!open) form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      {!!trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="w-120 sm:max-w-120">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {!isMobile && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <CreateStoryForm form={form} onSubmit={submit} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button disabled={isLoading} onClick={() => submit()}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
