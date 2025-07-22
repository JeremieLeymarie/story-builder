import { useState } from "react";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";

import { ContentEditable } from "@/design-system/components/editor/editor-ui/content-editable";

export const Plugins = () => {
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
        <div ref={onRef}>
          <ContentEditable placeholder={"Start typing ..."} />
        </div>
      }
      ErrorBoundary={LexicalErrorBoundary}
    />
  );
};
