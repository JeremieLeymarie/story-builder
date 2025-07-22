import { createContext, JSX, useContext } from "react";
import { LexicalEditor } from "lexical";

const Context = createContext<{
  activeEditor: LexicalEditor;
}>({
  activeEditor: {} as LexicalEditor,
});

export const ToolbarContext = ({
  activeEditor,
  children,
}: {
  activeEditor: LexicalEditor;
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
