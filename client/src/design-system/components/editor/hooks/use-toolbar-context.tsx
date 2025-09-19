import { createContext, JSX, useContext } from "react";
import { LexicalEditor } from "lexical";

const Context = createContext<{
  activeEditor: LexicalEditor;
  $updateToolbar: () => void;
  blockType: string;
  setBlockType: (blockType: string) => void;
  showModal: (
    title: string,
    showModal: (onClose: () => void) => JSX.Element,
  ) => void;
}>({
  activeEditor: {} as LexicalEditor,
  $updateToolbar: () => {},
  blockType: "paragraph",
  setBlockType: () => {},
  showModal: () => {},
});

export const ToolbarContext = ({
  activeEditor,
  $updateToolbar,
  blockType,
  setBlockType,
  showModal,
  children,
}: {
  activeEditor: LexicalEditor;
  $updateToolbar: () => void;
  blockType: string;
  setBlockType: (blockType: string) => void;
  showModal: (
    title: string,
    showModal: (onClose: () => void) => JSX.Element,
  ) => void;
  children: React.ReactNode;
}) => {
  return (
    <Context.Provider
      value={{
        activeEditor,
        $updateToolbar,
        blockType,
        setBlockType,
        showModal,
      }}
    >
      {children}
    </Context.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToolbarContext = () => {
  const context = useContext(Context);

  if (!context)
    throw new Error(
      "useToolbarContext must be used within a ToolbarContext. Did you forget to wrap your component in a useToolbarContext?",
    );

  return context;
};
