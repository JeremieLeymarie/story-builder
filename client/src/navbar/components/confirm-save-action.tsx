import { ConfirmDialog } from "@/design-system/components";
import { Button } from "@/design-system/primitives";
import { Link } from "@tanstack/react-router";
import { CloudUploadIcon } from "lucide-react";
import { ReactNode } from "react";

export const ConfirmSaveAction = ({
  save,
  onClose,
  isOpen,
  setIsOpen,
  trigger,
}: {
  save: () => void;
  onClose?: () => void;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  trigger?: ReactNode;
}) => {
  return (
    <ConfirmDialog
      title={
        <div className="text-primary flex items-center gap-2">
          <CloudUploadIcon />
          Save data in the cloud
        </div>
      }
      description={
        <>
          This will replace the state of your remote backup with data (your
          progress in your games and the stories you've created) from your local
          application. This action cannot be reversed. <br />
          Learn more about why we use this method{" "}
          <Link to="/about" target="_blank">
            <Button variant="link" className="m-0 p-0">
              here.
            </Button>
          </Link>
        </>
      }
      open={isOpen}
      setOpen={setIsOpen}
      onConfirm={() => {
        save();
        onClose?.();
      }}
      confirmLabel="Save"
      trigger={trigger}
    />
  );
};
