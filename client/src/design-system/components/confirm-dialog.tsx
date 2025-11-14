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

import type { ReactNode, MouseEvent } from "react";

type Props = {
  onCancel?: (e: MouseEvent) => void;
  onConfirm?: (e: MouseEvent) => void;
  title: ReactNode | string;
  description: ReactNode | string;
  trigger?: ReactNode | string;
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
      {!!trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
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
          <DialogClose onClick={onCancel} asChild>
            <Button variant="secondary">{cancelLabel}</Button>
          </DialogClose>
          <DialogClose onClick={onConfirm} asChild>
            <Button>{confirmLabel}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
