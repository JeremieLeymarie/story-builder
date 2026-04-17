import { useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isTableSelection } from "@lexical/table";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  BaseSelection,
} from "lexical";
import { $setBlocksType } from "@lexical/selection";
import {
  $createHeadingNode,
  $isHeadingNode,
  HeadingTagType,
} from "@lexical/rich-text";
import { ChevronDownIcon } from "lucide-react";

import { useUpdateToolbarHandler } from "@/design-system/components/editor/hooks/use-update-toolbar";
import { Button } from "@/design-system/primitives";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/design-system/primitives/dropdown-menu";
import { capitalize } from "@/lib/string";

type BlockType = "paragraph" | "h1" | "h2" | "h3" | "h4" | "h5";

const headingTagTypeToBlockType = (tagType: HeadingTagType): BlockType => {
  return tagType === "h6" ? "paragraph" : tagType;
};

const setParagraphBlock = () => {
  const selection = $getSelection();
  if ($isRangeSelection(selection)) {
    $setBlocksType(selection, () => $createParagraphNode());
  }
};

const setHeadingBlock = (headingLevel: "h1" | "h2" | "h3" | "h4" | "h5") => {
  const selection = $getSelection();
  if ($isRangeSelection(selection)) {
    $setBlocksType(selection, () => $createHeadingNode(headingLevel));
  }
};

const BLOCK_OPTIONS: ReadonlyArray<{ label: string; value: BlockType }> = [
  { label: "Paragraph", value: "paragraph" },
  { label: "Heading 1", value: "h1" },
  { label: "Heading 2", value: "h2" },
  { label: "Heading 3", value: "h3" },
  { label: "Heading 4", value: "h4" },
  { label: "Heading 5", value: "h5" },
];

const applyBlockType = (
  editor: ReturnType<typeof useLexicalComposerContext>[0],
  block: BlockType,
) => {
  editor.update(() => {
    if (block === "paragraph") {
      return setParagraphBlock();
    }
    setHeadingBlock(block);
  });
};

export const BlockFormatToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [currentBlockType, setCurrentBlockType] =
    useState<BlockType>("paragraph");

  const $updateToolbar = (selection: BaseSelection) => {
    if (!$isRangeSelection(selection) && !$isTableSelection(selection)) {
      return;
    }

    const anchorNode = selection.anchor.getNode();
    const element =
      anchorNode.getKey() === "root"
        ? anchorNode
        : anchorNode.getTopLevelElementOrThrow();

    // Paragraph are handled as h6 tags
    if ($isHeadingNode(element)) {
      const headingTag = element.getTag();
      setCurrentBlockType(headingTagTypeToBlockType(headingTag));
      return;
    }

    setCurrentBlockType("paragraph");
  };

  useUpdateToolbarHandler($updateToolbar);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <span>{capitalize(currentBlockType)}</span>
          <ChevronDownIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-44">
        <DropdownMenuLabel>Format</DropdownMenuLabel>
        {BLOCK_OPTIONS.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={currentBlockType === option.value}
            onSelect={(event) => {
              event.preventDefault();
              applyBlockType(editor, option.value);
            }}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
