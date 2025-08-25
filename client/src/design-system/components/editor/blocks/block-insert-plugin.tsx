import { PlusIcon } from "lucide-react";

import { useEditorModal } from "@/design-system/components/editor/editor-hooks/use-modal";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
} from "@/design-system/primitives/select";

export const BlockInsertPlugin = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [modal] = useEditorModal();

  return (
    <>
      {modal}
      <Select value={""}>
        <SelectTrigger className="!h-8 w-min gap-1">
          <PlusIcon className="size-4" />
          <span>Insert</span>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>{children}</SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
};
