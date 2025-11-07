/* eslint-disable react-refresh/only-export-components */
import { Entity } from "@/lib/storage/domain";
import { createContext, PropsWithChildren, useContext } from "react";

type EditorContext = {
  entityType: Extract<Entity, "scene" | "wiki-article">;
  entityKey?: string;
};

export const EditorContext = createContext<EditorContext | null>(null);

export const EditorContextProvider = ({
  children,
  ...value
}: PropsWithChildren<EditorContext>) => {
  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
};

export const useEditorContext = () => {
  const context = useContext(EditorContext);

  if (!context)
    throw new Error(
      "useEditorContext must be used within a EditorContextProvider. Did you forget to wrap your component in a EditorContextProvider?",
    );

  return context;
};
