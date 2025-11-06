import { ImageIcon } from "lucide-react";

import { InsertImageDialog } from "../../images-plugin/insert-image-form";
import { useToolbarContext } from "../../../hooks/use-toolbar-context";
import { Button } from "@/design-system/primitives";

export const InsertImage = () => {
  const { activeEditor, showModal } = useToolbarContext();

  return (
    <Button
      variant="outline"
      size="sm"
      onPointerUp={() => {
        showModal("Insert Image", (onClose) => (
          <InsertImageDialog activeEditor={activeEditor} onClose={onClose} />
        ));
      }}
    >
      <div className="flex items-center gap-1">
        <ImageIcon className="size-4" />
        <span>Image</span>
      </div>
    </Button>
  );
};
