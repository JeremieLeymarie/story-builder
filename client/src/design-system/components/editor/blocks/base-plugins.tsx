import { useRef, useState } from "react";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";

import { ContentEditable } from "@/design-system/components/editor/editor-ui/content-editable";
import { cn } from "@/lib/style";
import { ScrollArea } from "@/design-system/primitives/scroll-area";

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

  console.log({ editable });
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
            className={cn(editable && "px-4")}
            placeholder={"Start typing..."}
            ref={contentRef}
          />
        </ScrollArea>
      }
      ErrorBoundary={LexicalErrorBoundary}
    />
  );
};
