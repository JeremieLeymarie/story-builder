import { WikiNode } from "@/builder/lexical-wiki-node";
import { useEditorContext } from "@/design-system/components/editor/hooks/use-editor-context";
import { getWikiService } from "@/domains/wiki/wiki-service";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useQueryClient } from "@tanstack/react-query";
import { $getNodeByKey } from "lexical";
import { useEffect } from "react";

export const useUpdateArticleLinks = () => {
  const [editor] = useLexicalComposerContext();
  const wikiService = getWikiService();
  const { entityKey } = useEditorContext();
  const queryClient = useQueryClient();

  if (!entityKey) throw new Error("Entity key should be ");

  useEffect(() => {
    return editor.registerMutationListener(
      WikiNode,
      (mutatedNodes) => {
        editor.read(async () => {
          for (const [nodeKey, mutation] of mutatedNodes) {
            const { articleKey, articleLinkKey } =
              $getNodeByKey<WikiNode>(nodeKey) ?? {};
            if (!articleKey || !articleLinkKey) continue;

            if (mutation === "created") {
              await wikiService.addArticleLink({
                key: articleLinkKey,
                entityType: "scene", // For now wiki links are only available in scenes
                entityKey,
                articleKey,
              });
            } else if (mutation === "updated") {
              await wikiService.updateArticleLink({
                key: articleLinkKey,
                entityType: "scene", // For now wiki links are only available in scenes
                entityKey,
                articleKey,
              });
            } else if (mutation === "destroyed") {
              await wikiService.removeArticleLink({
                key: articleLinkKey,
                entityType: "scene", // For now wiki links are only available in scenes
                entityKey,
              });
            }

            queryClient.invalidateQueries({
              queryKey: ["get-article-link", articleLinkKey],
            });
          }
        });
      },
      { skipInitialization: false },
    );
  }, [wikiService, editor, entityKey]);
};
