import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { COMMAND_PRIORITY_CRITICAL, SELECTION_CHANGE_COMMAND } from "lexical";

import { useEditorModal } from "@/design-system/components/editor/hooks/use-modal";
import { ToolbarProvider } from "../../hooks/use-toolbar-context";

export const ToolbarPlugin = ({
  children,
}: {
  children: (props: { blockType: string }) => React.ReactNode;
}) => {
  const [editor] = useLexicalComposerContext();

  const [activeEditor, setActiveEditor] = useState(editor);
  const [modal, showModal] = useEditorModal();

  useEffect(() => {
    return activeEditor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [activeEditor, editor]);

  return (
    <ToolbarProvider activeEditor={activeEditor} showModal={showModal}>
      {modal}

      {children({ blockType: "paragraph" })}
    </ToolbarProvider>
  );
};
