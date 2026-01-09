import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import {
  KlassConstructor,
  LexicalNode,
  LexicalNodeReplacement,
  SerializedEditorState,
} from "lexical";

import { TooltipProvider } from "@/design-system/primitives/tooltip";

import { cn } from "@/lib/style";
import { EditorPlugins } from "../plugins/editor-plugins";
import { BasePlugins } from "../plugins/base-plugins";
import { ReactNode } from "react";
import { TextDisplayMode } from "../types";
import { LexicalContent } from "@/lib/lexical-content";
import { BASE_EDITOR_CONFIG } from "../constants";

type EditorNode = KlassConstructor<typeof LexicalNode> | LexicalNodeReplacement;

export const RichText = ({
  onSerializedChange,
  initialState,
  editable,
  className,
  textColor,
  toolbarPlugins,
  editorNodes,
  textDisplayMode,
}: {
  className?: string;
  textColor?: string;
  editable: boolean;
  initialState?: LexicalContent;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
  toolbarPlugins?: ReactNode[];
  editorNodes?: EditorNode[];
  textDisplayMode: TextDisplayMode;
}) => {
  return (
    <div
      className={cn(
        editable && "bg-background min-h-25 rounded-lg border shadow",
        "focus-within:border-ring focus-within:ring-ring/10 focus-within:ring-[3px]", // The focus style is the same as the input's & textarea's
        // TODO: handle error state like other inputs
      )}
    >
      <LexicalComposer
        initialConfig={{
          ...BASE_EDITOR_CONFIG,
          nodes: [...(BASE_EDITOR_CONFIG.nodes ?? []), ...(editorNodes ?? [])],
          editorState: JSON.stringify(initialState),
          editable,
        }}
      >
        <TooltipProvider>
          {editable && <EditorPlugins toolbarPlugins={toolbarPlugins} />}
          <BasePlugins
            className={className}
            textColor={textColor}
            editable={editable}
            textDisplayMode={textDisplayMode}
          />

          <OnChangePlugin
            ignoreSelectionChange={true}
            onChange={(editorState) => {
              onSerializedChange?.(editorState.toJSON());
            }}
          />
        </TooltipProvider>
      </LexicalComposer>
    </div>
  );
};
