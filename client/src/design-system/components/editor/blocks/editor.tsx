import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { EditorState, SerializedEditorState } from "lexical";

import { TooltipProvider } from "@/design-system/primitives/tooltip";

import { nodes } from "./nodes";
import { Plugins } from "./plugins";
import { useMemo } from "react";

const editorConfig: InitialConfigType = {
  namespace: "Editor",
  theme: {
    text: {
      underline: "underline",
      strikethrough: "line-through",
      underlineStrikethrough: "[text-decoration:underline_line-through]",
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
}: {
  editorState?: EditorState;
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
    <div className="bg-background max-h-75 min-h-25 overflow-y-auto rounded-lg border shadow">
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          ...(editorSerializedState
            ? { editorState: JSON.stringify(editorSerializedState) }
            : {}),
        }}
      >
        <TooltipProvider>
          <Plugins />

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
