import { AlertTriangleIcon } from "lucide-react";
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
} from "../primitives";

type Props = {
  onCancel?: () => void;
  onConfirm?: () => void;
  title: JSX.Element | string;
  description: JSX.Element | string;
  trigger?: JSX.Element | string;
  cancelLabel?: string;
  confirmLabel?: string;
  open?: boolean;
  setOpen?: (open: boolean) => void;
};

export const ConfirmDialog = ({
  title,
  description,
  trigger,
  onCancel,
  onConfirm,
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  open,
  setOpen,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!!trigger && <DialogTrigger>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {typeof title === "string" ? (
              <>
                <AlertTriangleIcon size="20px" />
                {title}
              </>
            ) : (
              title
            )}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-2">
          <DialogClose onClick={onCancel}>
            <Button variant="secondary">{cancelLabel}</Button>
          </DialogClose>
          <DialogClose onClick={onConfirm}>
            <Button>{confirmLabel}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
