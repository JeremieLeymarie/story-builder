import { DropdownMenuItem } from "@/design-system/primitives";
import { useIsOnline } from "@/hooks/use-is-online";
import { CloudDownloadIcon } from "lucide-react";
import { useState } from "react";
import { ConfirmLoadAction } from "./confirm-load-action";

export const LoadMenuItem = ({
  load,
  onClose,
}: {
  load: () => void;
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
        <CloudDownloadIcon size="18px" />
        <span>Load</span>
      </DropdownMenuItem>

      <ConfirmLoadAction
        onClose={onClose}
        load={load}
        setIsOpen={setIsModalOpen}
        isOpen={isModalOpen}
      />
    </>
  );
};
