import { ToolbarPlugin } from "@/design-system/components/editor/plugins/toolbar/toolbar-plugin";
import { FontFormatToolbarPlugin } from "@/design-system/components/editor/plugins/toolbar/font-format-toolbar-plugin";
import { BasePlugins } from "./base-plugins";
import { BlockInsertPlugin } from "./block-insert-plugin";
import { InsertImage } from "@/design-system/components/editor/plugins/toolbar/block-insert/insert-image";
import { ImagesPlugin } from "../plugins/images-plugin/plugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";

export const EditorPlugins = ({ editable }: { editable: boolean }) => {
  return (
    <>
      <ToolbarPlugin>
        {() => (
          <div className="vertical-align-middle sticky top-0 z-10 flex gap-2 overflow-auto border-b bg-white p-1">
            <FontFormatToolbarPlugin format="bold" />
            <FontFormatToolbarPlugin format="italic" />
            <FontFormatToolbarPlugin format="underline" />
            <FontFormatToolbarPlugin format="strikethrough" />
            <BlockInsertPlugin>
              <InsertImage />
            </BlockInsertPlugin>
          </div>
        )}
      </ToolbarPlugin>
      <ImagesPlugin />
      <HistoryPlugin />
      <BasePlugins editable={editable} />
    </>
  );
};
