import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { EditorState, SerializedEditorState } from "lexical";

import { TooltipProvider } from "@/design-system/primitives/tooltip";

import { nodes } from "./nodes";
import { EditorPlugins } from "./editor-plugins";
import { useMemo } from "react";
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
  sceneKey,
  editable,
}: {
  editable: boolean;
  editorSerializedState?: SerializedEditorState;
  onChange?: (editorState: EditorState) => void;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
  sceneKey: string;
}) => {
  // The key is used to force lexical to update its initial value.
  // We need it to change only when the editor state changes, to avoid de-synchronization issues
  // In the lifecycle, sceneKey (from global store) is updated before the scene content (from form);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const key = useMemo(() => sceneKey, [editorSerializedState]);
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
