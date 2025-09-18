import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { EditorState, SerializedEditorState } from "lexical";

import { TooltipProvider } from "@/design-system/primitives/tooltip";

import { nodes } from "./nodes";
import { EditorPlugins } from "./editor-plugins";
import { BasePlugins } from "./base-plugins";
import { cn } from "@/lib/style";

const editorConfig: InitialConfigType = {
  namespace: "Editor",
  theme: {
    text: {
      underline: "underline",
      strikethrough: "line-through",
      underlineStrikethrough: "[text-decoration:underline_line-through]",
      bold: "bold",
      italic: "italic",
    },
  },
  nodes,
  onError: (error: Error) => {
    console.error(error);
  },
};

export const RichText = ({
  initialState,
  onChange,
  onSerializedChange,
  editable,
  className,
}: {
  className?: string;
  editable: boolean;
  initialState?: SerializedEditorState;
  onChange?: (editorState: EditorState) => void;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
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
          ...editorConfig,
          ...(initialState
            ? { editorState: JSON.stringify(initialState) }
            : {}),
          editable,
        }}
      >
        <TooltipProvider>
          {editable && <EditorPlugins />}
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
