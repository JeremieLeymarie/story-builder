import { useRef, useState } from "react";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { cn } from "@/lib/style";
import { ScrollArea } from "@/design-system/primitives/scroll-area";
import { ContentEditable } from "../components/content-editable";

export const BasePlugins = ({
  editable,
  className,
}: {
  editable: boolean;
  className?: string;
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
        <ScrollArea
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
        </ScrollArea>
      }
      ErrorBoundary={LexicalErrorBoundary}
    />
  );
};
