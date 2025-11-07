import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  BaseSelection,
  COMMAND_PRIORITY_CRITICAL,
  SELECTION_CHANGE_COMMAND,
} from "lexical";

export const useUpdateToolbarHandler = (
  callback: (selection: BaseSelection) => void,
) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection();
        if (selection) {
          callback(selection);
        }
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, callback]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (selection) {
        callback(selection);
      }
    });
  }, [editor, callback]);
};
