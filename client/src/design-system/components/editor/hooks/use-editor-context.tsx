/* eslint-disable react-refresh/only-export-components */
import { Entity } from "@/lib/storage/domain";
import {
  createContext,
  PropsWithChildren,
  RefObject,
  useContext,
  useRef,
} from "react";

type EditorContext = {
  entityType: Extract<Entity, "scene" | "wiki-article">;
  entityKey?: string;
  contentEditableRef: RefObject<HTMLDivElement | null>;
};

export const EditorContext = createContext<EditorContext | null>(null);

export const EditorContextProvider = ({
  children,
  ...value
}: PropsWithChildren<Pick<EditorContext, "entityKey" | "entityType">>) => {
  const contentEditableRef = useRef<HTMLDivElement>(null);

  return (
    <EditorContext.Provider value={{ ...value, contentEditableRef }}>
      {children}
    </EditorContext.Provider>
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
