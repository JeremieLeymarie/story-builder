import { DropdownMenuItem } from "@/design-system/primitives";
import { useIsOnline } from "@/hooks/use-is-online";
import { CloudUploadIcon } from "lucide-react";
import { useState } from "react";
import { ConfirmSaveAction } from "./confirm-save-action";

export const SaveMenuItem = ({
  save,
  onClose,
}: {
  save: () => void;
  onClose: () => void;
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

      <ConfirmSaveAction
        save={save}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onClose={onClose}
      />
    </>
  );
};
