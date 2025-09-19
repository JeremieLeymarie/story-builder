import { ImageIcon } from "lucide-react";

import { SelectItem } from "@/design-system/primitives/select";
import { InsertImageDialog } from "../../images-plugin/insert-image-form";
import { useToolbarContext } from "../../../hooks/use-toolbar-context";

export const InsertImage = () => {
  const { activeEditor, showModal } = useToolbarContext();

  return (
    <SelectItem
      value="image"
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
    </SelectItem>
  );
};
