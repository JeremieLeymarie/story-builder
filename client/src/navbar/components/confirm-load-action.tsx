import { ConfirmDialog } from "@/design-system/components";
import { Button } from "@/design-system/primitives";
import { Link } from "@tanstack/react-router";
import { CloudDownloadIcon } from "lucide-react";
import { ReactNode } from "react";

export const ConfirmLoadAction = ({
  load,
  onClose,
  isOpen,
  setIsOpen,
  trigger,
}: {
  load: () => void;
  onClose?: () => void;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  trigger?: ReactNode;
}) => {
  return (
    <ConfirmDialog
      title={
        <div className="text-primary flex items-center gap-2">
          <CloudDownloadIcon />
          Load data from cloud backup
        </div>
      }
      description={
        <>
          This will replace the state of your stories (both in your library and
          in the builder) with data you've saved on the cloud. This action
          cannot be reversed. <br />
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
        load();
        onClose?.();
      }}
      confirmLabel="Load"
      trigger={trigger}
    />
  );
};
