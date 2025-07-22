import { useState } from "react";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";

import { ContentEditable } from "@/design-system/components/editor/editor-ui/content-editable";
import { ToolbarPlugin } from "@/design-system/components/editor/plugins/toolbar/toolbar-plugin";
import { FontFormatToolbarPlugin } from "@/design-system/components/editor/plugins/toolbar/font-format-toolbar-plugin";

export const Plugins = () => {
  const [_floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <>
      <ToolbarPlugin>
        {() => (
          <div className="vertical-align-middle sticky top-0 z-10 flex gap-2 overflow-auto border-b bg-white p-1">
            <FontFormatToolbarPlugin format="bold" />
            <FontFormatToolbarPlugin format="italic" />
            <FontFormatToolbarPlugin format="underline" />
            <FontFormatToolbarPlugin format="strikethrough" />
          </div>
        )}
      </ToolbarPlugin>
      <RichTextPlugin
        contentEditable={
          <div ref={onRef}>
            <ContentEditable placeholder={"Start typing ..."} />
          </div>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
    </>
  );
};
