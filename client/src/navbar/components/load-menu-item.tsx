import { ConfirmDialog } from "@/design-system/components";
import { Button, DropdownMenuItem } from "@/design-system/primitives";
import { useIsOnline } from "@/hooks/use-is-online";
import { Link } from "@tanstack/react-router";
import { CloudDownloadIcon } from "lucide-react";
import { useState } from "react";

export const LoadMenuItem = ({
  load,
  closeMenu,
}: {
  load: () => void;
  closeMenu: () => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isOnline = useIsOnline();

  return (
    <>
      <DropdownMenuItem
        disabled={!isOnline}
        onSelect={(e) => {
          e.preventDefault();
          setIsModalOpen(true);
        }}
        className="flex w-full items-center gap-2"
      >
        <CloudDownloadIcon size="18px" />
        <span>Load</span>
      </DropdownMenuItem>

      <ConfirmDialog
        title={
          <div className="text-primary flex items-center gap-2">
            <CloudDownloadIcon />
            Load data from cloud backup
          </div>
        }
        description={
          <>
            This will replace the state of your stories (both in your library
            and in the builder) with data you've saved on the cloud. This action
            cannot be reversed. <br />
            Learn more about why we use this method{" "}
            <Link to="/about" target="_blank">
              <Button variant="link" className="m-0 p-0">
                here.
              </Button>
            </Link>
          </>
        }
        open={isModalOpen}
        setOpen={setIsModalOpen}
        onConfirm={() => {
          load();
          closeMenu();
        }}
        confirmLabel="Load"
      />
    </>
  );
};
