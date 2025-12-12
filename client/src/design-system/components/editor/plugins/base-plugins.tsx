import { CSSProperties, ReactNode } from "react";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { cn } from "@/lib/style";
import { ScrollArea } from "@/design-system/primitives/scroll-area";
import { ContentEditable } from "../components/content-editable";
import { TextDisplayMode } from "../types";
import { match } from "ts-pattern";
import { useEditorContext } from "../hooks/use-editor-context";

const RichTextContainer = ({
  textDisplayMode,
  children,
  ...props
}: {
  textDisplayMode: TextDisplayMode;
  children: ReactNode;
  className?: string;
  onClick: () => void;
}) => {
  return match(textDisplayMode)
    .with("full", () => <div {...props}>{children}</div>)
    .with("scroll", () => <ScrollArea {...props}>{children}</ScrollArea>)
    .with("summary", () => (
      <div
        {...props}
        className="[&_img]:hidden"
        style={
          {
            display: "-webkit-box",
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          } as CSSProperties
        }
      >
        {children}
      </div>
    ))
    .exhaustive();
};

export const BasePlugins = ({
  editable,
  className,
  textColor,
  textDisplayMode,
}: {
  editable: boolean;
  className?: string;
  textColor?: string;
  textDisplayMode: TextDisplayMode;
}) => {
  const { contentEditableRef } = useEditorContext();

  return (
    <RichTextPlugin
      contentEditable={
        <RichTextContainer
          textDisplayMode={textDisplayMode}
          className={cn("relative my-0.5 mr-0.5", className)}
          onClick={() => {
            contentEditableRef.current?.focus();
          }}
        >
          <ContentEditable
            className={cn(editable ? "px-4" : "px-0 py-0")}
            placeholder={editable ? "Once upon a time..." : ""}
            textColor={textColor}
          />
        </RichTextContainer>
      }
      ErrorBoundary={LexicalErrorBoundary}
    />
  );
};
