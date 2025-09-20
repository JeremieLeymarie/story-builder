import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { EditorState, SerializedEditorState } from "lexical";

import { TooltipProvider } from "@/design-system/primitives/tooltip";

import { cn } from "@/lib/style";
import { TextDisplayMode } from "../types";
import { EditorPlugins } from "../plugins/editor-plugins";
import { BasePlugins } from "../plugins/base-plugins";
import { LexicalContent } from "@/lib/lexical-content";
import { BASE_EDITOR_CONFIG } from "../constants";

export const RichText = ({
  onChange,
  onSerializedChange,
  initialState,
  editable,
  className,
  textDisplayMode,
}: {
  className?: string;
  editable: boolean;
  initialState?: LexicalContent;
  onChange?: (editorState: EditorState) => void;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
  textDisplayMode: TextDisplayMode;
}) => {
  // This allows lexical to refresh it's initial state when the content changes from the outside
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
          ...BASE_EDITOR_CONFIG,
          editorState: state,
          editable,
        }}
      >
        <TooltipProvider>
          {editable && <EditorPlugins />}
          <BasePlugins
            className={className}
            editable={editable}
            textDisplayMode={textDisplayMode}
          />

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
