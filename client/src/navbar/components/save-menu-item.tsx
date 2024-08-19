import { ConfirmDialog } from "@/design-system/components";
import { Button, DropdownMenuItem } from "@/design-system/primitives";
import { useIsOnline } from "@/hooks/use-is-online";
import { Link } from "@tanstack/react-router";
import { CloudUploadIcon } from "lucide-react";
import { useState } from "react";

export const SaveMenuItem = ({
  save,
  closeMenu,
}: {
  save: () => void;
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
        <CloudUploadIcon size="18px" />
        <span>Save</span>
      </DropdownMenuItem>

      <ConfirmDialog
        title={
          <div className="flex items-center gap-2 text-primary">
            <CloudUploadIcon />
            Save data in the cloud
          </div>
        }
        description={
          <>
            This will replace the state of your remote backup with data (your
            progress in your games and the stories you've created) from your
            local application. This action cannot be reversed. <br />
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
          save();
          closeMenu();
        }}
        confirmLabel="Save"
      />
    </>
  );
};
