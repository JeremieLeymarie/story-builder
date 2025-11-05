import { ToolbarPlugin } from "@/design-system/components/editor/plugins/toolbar/toolbar-plugin";
import { FontFormatToolbarPlugin } from "@/design-system/components/editor/plugins/toolbar/font-format-toolbar-plugin";
import { BlockInsertPlugin } from "./block-insert-plugin";
import { InsertImage } from "@/design-system/components/editor/plugins/toolbar/block-insert/insert-image";
import { ImagesPlugin } from "../plugins/images-plugin/plugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { WikiPlugin } from "./wiki-plugin/wiki-plugin";

export const EditorPlugins = ({
  wikiIntegrationEnabled,
}: {
  wikiIntegrationEnabled: boolean;
}) => {
  return (
    <>
      <ToolbarPlugin>
        {() => (
          <div className="vertical-align-middle border-tl sticky top-0 z-10 flex gap-2 overflow-auto rounded-t-lg border-b bg-white p-1">
            <FontFormatToolbarPlugin format="bold" />
            <FontFormatToolbarPlugin format="italic" />
            <FontFormatToolbarPlugin format="underline" />
            <FontFormatToolbarPlugin format="strikethrough" />
            <BlockInsertPlugin>
              <InsertImage />
            </BlockInsertPlugin>
            {wikiIntegrationEnabled && <WikiPlugin />}
          </div>
        )}
      </ToolbarPlugin>
      <ImagesPlugin />
      <HistoryPlugin />
    </>
  );
};
