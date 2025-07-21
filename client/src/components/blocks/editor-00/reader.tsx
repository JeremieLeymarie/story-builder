import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { EditorState, SerializedEditorState } from "lexical";
import { TooltipProvider } from "@/design-system/primitives/tooltip";

import { Plugins } from "./gamePlugins";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

const editorConfig: InitialConfigType = {
  namespace: "Reader",
  editable: false,
  theme: {
    text: {
      underline: "underline",
      strikethrough: "line-through",
      underlineStrikethrough: "[text-decoration:underline_line-through]",
    },
  },
  onError: (error: Error) => {
    console.error(error);
  },
};

export function Reader({
  editorState,
  editorSerializedState,
  onChange,
  onSerializedChange,
}: {
  editorState?: EditorState;
  editorSerializedState?: SerializedEditorState;
  onChange?: (editorState: EditorState) => void;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
}) {
  return (
    <div>
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          ...(editorState ? { editorState } : {}),
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
}
