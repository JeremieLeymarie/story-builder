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
import { $createHeadingNode, $isHeadingNode } from "@lexical/rich-text";
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

type BlockType = "paragraph" | "h1" | "h2" | "h3" | "h4" | "h5";

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

const getBlockLabel = (blockType: BlockType) => {
  switch (blockType) {
    case "paragraph":
      return "Paragraph";
    case "h1":
      return "H1";
    case "h2":
      return "H2";
    case "h3":
      return "H3";
    case "h4":
      return "H4";
    case "h5":
      return "H5";
    default:
      return "Paragraph";
  }
};

export const BlockFormatToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [blockType, setBlockType] = useState<BlockType>("paragraph");

  const $updateToolbar = (selection: BaseSelection) => {
    if (!$isRangeSelection(selection) && !$isTableSelection(selection)) {
      return;
    }

    const anchorNode = selection.anchor.getNode();
    const element =
      anchorNode.getKey() === "root"
        ? anchorNode
        : anchorNode.getTopLevelElementOrThrow();

    if ($isHeadingNode(element)) {
      const headingTag = element.getTag();
      setBlockType(
        headingTag === "h1" ||
          headingTag === "h2" ||
          headingTag === "h3" ||
          headingTag === "h4" ||
          headingTag === "h5"
          ? headingTag
          : "paragraph",
      );
      return;
    }

    setBlockType("paragraph");
  };

  useUpdateToolbarHandler($updateToolbar);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <span>{getBlockLabel(blockType)}</span>
          <ChevronDownIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-44">
        <DropdownMenuLabel>Format</DropdownMenuLabel>
        <DropdownMenuCheckboxItem
          checked={blockType === "paragraph"}
          onSelect={(event) => {
            event.preventDefault();
            editor.update(setParagraphBlock);
          }}
        >
          Paragraph
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={blockType === "h1"}
          onSelect={(event) => {
            event.preventDefault();
            editor.update(() => {
              setHeadingBlock("h1");
            });
          }}
        >
          Heading 1
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={blockType === "h2"}
          onSelect={(event) => {
            event.preventDefault();
            editor.update(() => {
              setHeadingBlock("h2");
            });
          }}
        >
          Heading 2
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={blockType === "h3"}
          onSelect={(event) => {
            event.preventDefault();
            editor.update(() => {
              setHeadingBlock("h3");
            });
          }}
        >
          Heading 3
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={blockType === "h4"}
          onSelect={(event) => {
            event.preventDefault();
            editor.update(() => {
              setHeadingBlock("h4");
            });
          }}
        >
          Heading 4
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={blockType === "h5"}
          onSelect={(event) => {
            event.preventDefault();
            editor.update(() => {
              setHeadingBlock("h5");
            });
          }}
        >
          Heading 5
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
