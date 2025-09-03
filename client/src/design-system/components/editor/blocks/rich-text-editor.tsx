import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { EditorState } from "lexical";

import { TooltipProvider } from "@/design-system/primitives/tooltip";

import { nodes } from "./nodes";
import { EditorPlugins } from "./editor-plugins";
import { BasePlugins } from "./base-plugins";
import { cn } from "@/lib/style";
import { contentSchema, SceneContent } from "@/lib/scene-content";

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
  onChange,
  onSerializedChange,
  initialState,
  editable,
  className,
}: {
  className?: string;
  editable: boolean;
  initialState?: SceneContent;
  onChange?: (editorState: EditorState) => void;
  onSerializedChange?: (editorSerializedState: SceneContent) => void;
}) => {
  // This allow lexical to refresh it's initial state when the content changes from the outside
  const state = JSON.stringify(initialState);
  return (
    <div
      className={cn(
        editable && "bg-background min-h-25 rounded-lg border shadow",
        "focus-within:border-ring focus-within:ring-ring/10 focus-within:ring-[3px]", // The focus style is the same as the input's & textarea's
        // TODO: handle error state like other inputs
      )}
    >
      <LexicalComposer
        key={state}
        initialConfig={{
          ...editorConfig,
          editorState: state,
          editable,
        }}
      >
        <TooltipProvider>
          {editable && <EditorPlugins />}
          <BasePlugins className={className} editable={editable} />

          <OnChangePlugin
            ignoreSelectionChange={true}
            onChange={(editorState) => {
              onChange?.(editorState);
              const serialized = editorState.toJSON();
              try {
                const sceneContent = contentSchema.parse(serialized);
                onSerializedChange?.(sceneContent);
              } catch (error) {
                console.error("Invalid content update", serialized);
                throw error;
              }
            }}
          />
        </TooltipProvider>
      </LexicalComposer>
    </div>
  );
};
