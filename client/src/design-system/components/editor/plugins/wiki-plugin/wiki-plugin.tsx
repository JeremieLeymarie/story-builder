import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
} from "lexical";
import { $createWikiNode, WikiNode } from "../../nodes/wiki-node";
import { useEffect } from "react";
import { Button } from "@/design-system/primitives";

// eslint-disable-next-line react-refresh/only-export-components
export const INSERT_WIKI_COMMAND: LexicalCommand<string> = createCommand();

export const WikiPlugin = () => {
  const [editor] = useLexicalComposerContext();

  if (!editor.hasNodes([WikiNode]))
    throw new Error(
      "WikiPlugin: WikiNode not registered on editor (initialConfig.nodes)",
    );

  useEffect(() => {
    return editor.registerCommand<string>(
      INSERT_WIKI_COMMAND,
      (articleKey) => {
        const selection = $getSelection();
        // TODO: what is rangeSelection?
        if ($isRangeSelection(selection)) {
          const textContent = selection.getTextContent();
          const wikiNode = $createWikiNode(articleKey, textContent);
          selection.insertNodes([wikiNode]);
        }
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() =>
        editor.dispatchCommand(
          INSERT_WIKI_COMMAND,
          "hihi-je-suis-une-article-key",
        )
      }
    >
      CREATE WIKI
    </Button>
  );
};
