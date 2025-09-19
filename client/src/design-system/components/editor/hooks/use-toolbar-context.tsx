import { createContext, ReactNode, useContext } from "react";
import { LexicalEditor } from "lexical";

type ToolbarContext = {
  activeEditor: LexicalEditor;
  showModal: (
    title: string,
    showModal: (onClose: () => void) => ReactNode,
  ) => void;
};

const Context = createContext<ToolbarContext>({
  activeEditor: {} as LexicalEditor,
  showModal: () => {},
});

export const ToolbarProvider = ({
  activeEditor,
  showModal,
  children,
}: ToolbarContext & {
  children: ReactNode;
}) => {
  return (
    <Context.Provider
      value={{
        activeEditor,
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
