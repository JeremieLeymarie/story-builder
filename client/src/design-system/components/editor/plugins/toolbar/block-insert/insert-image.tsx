import { ImageIcon } from "lucide-react";

import { useToolbarContext } from "@/design-system/components/editor/context/toolbar-context";
import { SelectItem } from "@/design-system/primitives/select";
import { InsertImageDialog } from "../../images-plugin/insert-image-form";

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
