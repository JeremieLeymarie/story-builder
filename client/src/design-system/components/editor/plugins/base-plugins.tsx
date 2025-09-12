import { CSSProperties, ReactNode, useRef, useState } from "react";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { cn } from "@/lib/style";
import { ScrollArea } from "@/design-system/primitives/scroll-area";
<<<<<<< HEAD:client/src/design-system/components/editor/plugins/base-plugins.tsx
import { ContentEditable } from "../components/content-editable";
=======
import { TextDisplayMode } from "../types";
import { match } from "ts-pattern";

const RichTextContainer = ({
  textDisplayMode,
  children,
  ...props
}: {
  textDisplayMode: TextDisplayMode;
  children: ReactNode;
  className?: string;
  ref: (_floatingAnchorElem: HTMLDivElement) => void;
  onClick: () => void;
}) => {
  return match(textDisplayMode)
    .with("full", () => <div {...props}>{children}</div>)
    .with("scroll", () => <ScrollArea {...props}>{children}</ScrollArea>)
    .with("summary", () => (
      <div
        {...props}
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
>>>>>>> 220aec0 (:lipstick: Rich Text - Implement text display modes (scroll, summary, full)):client/src/design-system/components/editor/blocks/base-plugins.tsx

export const BasePlugins = ({
  editable,
  className,
  textDisplayMode,
}: {
  editable: boolean;
  className?: string;
  textDisplayMode: TextDisplayMode;
}) => {
  const [_floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <RichTextPlugin
      contentEditable={
        <RichTextContainer
          textDisplayMode={textDisplayMode}
          ref={onRef}
          className={cn("relative my-0.5 mr-0.5", className)}
          onClick={() => {
            contentRef.current?.focus();
          }}
        >
          <ContentEditable
            className={cn(editable ? "max-w-[400px] px-4" : "px-0 py-0")}
            placeholder={editable ? "Once upon a time..." : ""}
            ref={contentRef}
          />
        </RichTextContainer>
      }
      ErrorBoundary={LexicalErrorBoundary}
    />
  );
};
