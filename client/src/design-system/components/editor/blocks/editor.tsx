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

export const Editor = ({
  editorSerializedState,
  onChange,
  onSerializedChange,
  editable,
}: {
  editable: boolean;
  editorSerializedState?: SerializedEditorState;
  onChange?: (editorState: EditorState) => void;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
}) => {
  // This allow lexical to refresh it's initial state when the content changes from the outside
  const key = JSON.stringify(editorSerializedState);

  return (
    <div
      className={cn(
        editable &&
          "bg-background max-h-75 min-h-25 overflow-y-auto rounded-lg border shadow",
      )}
    >
      <LexicalComposer
        key={key}
        initialConfig={{
          ...editorConfig,
          ...(editorSerializedState
            ? { editorState: JSON.stringify(editorSerializedState) }
            : {}),
          editable,
        }}
      >
        <TooltipProvider>
          {editable ? (
            <EditorPlugins editable={editable} />
          ) : (
            <BasePlugins editable={editable} />
          )}

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
