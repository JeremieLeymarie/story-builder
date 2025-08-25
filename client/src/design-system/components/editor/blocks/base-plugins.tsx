import { useState } from "react";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";

import { ContentEditable } from "@/design-system/components/editor/editor-ui/content-editable";
import { cn } from "@/lib/style";

export const BasePlugins = ({ editable }: { editable: boolean }) => {
  const [_floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <RichTextPlugin
      contentEditable={
        <div>
          <div ref={onRef} className="relative">
            <ContentEditable
              className={cn(editable ? "max-w-[400px] px-4" : "px-0")}
              placeholder={"Start typing ..."}
            />
          </div>
        </div>
      }
      ErrorBoundary={LexicalErrorBoundary}
    />
  );
};
