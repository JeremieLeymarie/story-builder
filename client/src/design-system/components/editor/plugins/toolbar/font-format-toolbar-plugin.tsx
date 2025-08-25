import { useState } from "react";
import { $isTableSelection } from "@lexical/table";
import {
  $isRangeSelection,
  BaseSelection,
  FORMAT_TEXT_COMMAND,
  TextFormatType,
} from "lexical";
import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "lucide-react";

import { useToolbarContext } from "@/design-system/components/editor/context/toolbar-context";
import { useUpdateToolbarHandler } from "@/design-system/components/editor/editor-hooks/use-update-toolbar";
import { Toggle } from "@/design-system/primitives/toggle";

const Icons: Partial<Record<TextFormatType, React.ElementType>> = {
  bold: BoldIcon,
  italic: ItalicIcon,
  underline: UnderlineIcon,
  strikethrough: StrikethroughIcon,
  code: CodeIcon,
} as const;

export const FontFormatToolbarPlugin = ({
  format,
}: {
  format: Omit<TextFormatType, "highlight" | "subscript" | "superscript">;
}) => {
  const { activeEditor } = useToolbarContext();
  const [isSelected, setIsSelected] = useState<boolean>(false);

  const $updateToolbar = (selection: BaseSelection) => {
    if ($isRangeSelection(selection) || $isTableSelection(selection)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setIsSelected(selection.hasFormat(format as TextFormatType));
    }
  };

  useUpdateToolbarHandler($updateToolbar);

  const Icon = Icons[format as TextFormatType] as React.ElementType;

  return (
    <Toggle
      aria-label="Toggle bold"
      variant="outline"
      size="sm"
      defaultPressed={isSelected}
      pressed={isSelected}
      onPressedChange={setIsSelected}
      onClick={() => {
        activeEditor.dispatchCommand(
          FORMAT_TEXT_COMMAND,
          format as TextFormatType,
        );
      }}
    >
      <Icon className="h-4 w-4" />
    </Toggle>
  );
};
