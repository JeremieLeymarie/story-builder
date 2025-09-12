import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import {
  EditorState,
  KlassConstructor,
  LexicalNode,
  LexicalNodeReplacement,
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
import { ReactNode } from "react";
import { SceneContent } from "@/lib/scene-content";
import { TextDisplayMode } from "../types";

type EditorNode = KlassConstructor<typeof LexicalNode> | LexicalNodeReplacement;

export const RichText = ({
  onChange,
  onSerializedChange,
  initialState,
  editable,
  className,
<<<<<<< HEAD:client/src/design-system/components/editor/components/rich-text-editor.tsx
  toolbarPlugins,
  editorNodes,
=======
  textDisplayMode,
>>>>>>> 220aec0 (:lipstick: Rich Text - Implement text display modes (scroll, summary, full)):client/src/design-system/components/editor/blocks/rich-text-editor.tsx
}: {
  className?: string;
  editable: boolean;
  initialState?: SceneContent;
  onChange?: (editorState: EditorState) => void;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
<<<<<<< HEAD:client/src/design-system/components/editor/components/rich-text-editor.tsx
  toolbarPlugins?: ReactNode[];
  editorNodes?: EditorNode[];
=======
  textDisplayMode: TextDisplayMode;
>>>>>>> 220aec0 (:lipstick: Rich Text - Implement text display modes (scroll, summary, full)):client/src/design-system/components/editor/blocks/rich-text-editor.tsx
}) => {
  // This allow lexical to refresh it's initial state when the content changes from the outside
  const state = JSON.stringify(initialState);
  return (
    <div
      className={cn(
        editable && "bg-background min-h-25 rounded-lg border shadow",
        "focus-within:border-ring focus-within:ring-ring/10 focus-within:ring-[3px]", // The focus style is the same as the input's & textarea's
        // TODO: handle error state like other inputs
      )}
    >
      <LexicalComposer
        key={state}
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
            ...(editorNodes ?? []),
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
<<<<<<< HEAD:client/src/design-system/components/editor/components/rich-text-editor.tsx
          {editable && <EditorPlugins toolbarPlugins={toolbarPlugins} />}
          <BasePlugins className={className} editable={editable} />
=======
          {editable && <EditorPlugins />}
          <BasePlugins
            className={className}
            editable={editable}
            textDisplayMode={textDisplayMode}
          />
>>>>>>> 220aec0 (:lipstick: Rich Text - Implement text display modes (scroll, summary, full)):client/src/design-system/components/editor/blocks/rich-text-editor.tsx

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
