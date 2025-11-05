import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import {
  EditorState,
  ParagraphNode,
  SerializedEditorState,
  TextNode,
} from "lexical";

import { TooltipProvider } from "@/design-system/primitives/tooltip";

import { cn } from "@/lib/style";
import { EditorPlugins } from "../plugins/editor-plugins";
import { BasePlugins } from "../plugins/base-plugins";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ImageNode } from "../nodes/image-node";
import { WikiNode } from "../nodes/wiki-node";

export const RichText = ({
  initialState,
  onChange,
  onSerializedChange,
  editable,
  className,
  wikiIntegrationEnabled = false,
}: {
  className?: string;
  editable: boolean;
  initialState?: SerializedEditorState;
  onChange?: (editorState: EditorState) => void;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
  wikiIntegrationEnabled?: boolean;
}) => {
  // This allow lexical to refresh it's initial state when the content changes from the outside
  const key = JSON.stringify(initialState);

  return (
    <div
      className={cn(
        editable && "bg-background min-h-25 rounded-lg border shadow",
        "focus-within:border-ring focus-within:ring-ring/10 focus-within:ring-[3px]", // The focus style is the same as the input's & textarea's
        // TODO: handle error state like other inputs
      )}
    >
      <LexicalComposer
        key={key}
        initialConfig={{
          namespace: "Editor",
          theme: {
            text: {
              underline: "underline",
              strikethrough: "line-through",
              underlineStrikethrough:
                "[text-decoration:underline_line-through]",
              bold: "bold",
              italic: "italic",
            },
          },
          nodes: [
            HeadingNode,
            ParagraphNode,
            TextNode,
            QuoteNode,
            ImageNode,
            ...(wikiIntegrationEnabled ? [WikiNode] : []),
          ],
          onError: (error: Error) => {
            console.error(error);
          },
          editable,
          ...(initialState
            ? { editorState: JSON.stringify(initialState) }
            : {}),
        }}
      >
        <TooltipProvider>
          {editable && (
            <EditorPlugins wikiIntegrationEnabled={wikiIntegrationEnabled} />
          )}
          <BasePlugins className={className} editable={editable} />

          <OnChangePlugin
            ignoreSelectionChange={true}
            onChange={(editorState) => {
              onChange?.(editorState);
              onSerializedChange?.(editorState.toJSON());
            }}
          />
        </TooltipProvider>
      </LexicalComposer>
    </div>
  );
};
