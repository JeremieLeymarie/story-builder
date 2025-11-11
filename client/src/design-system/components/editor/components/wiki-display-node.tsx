import { useQuery } from "@tanstack/react-query";
import { useEditorContext } from "../hooks/use-editor-context";
import { getWikiService } from "@/domains/wiki/wiki-service";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/design-system/primitives/tooltip";
import { Link } from "@tanstack/react-router";
import { RichText } from "./rich-text-editor";
import { SerializedEditorState } from "lexical";
import { WikiNode } from "../nodes/wiki-node";

export const DisplayWikiNodeComponent = ({
  articleLinkKey,
  textContent,
}: {
  articleLinkKey?: string;
  textContent?: string;
}) => {
  const { entityKey } = useEditorContext();

  const { data: article } = useQuery({
    queryKey: ["get-article-link", articleLinkKey],
    queryFn: async () => {
      const wikiService = getWikiService();
      const articleLink = await wikiService.getArticleLink(
        articleLinkKey!,
        entityKey!,
      );
      if (!articleLink) throw new Error("Article key not found");
      const article = await wikiService.getArticle(articleLink?.articleKey);
      return article;
    },
    enabled: !!entityKey && !!articleLinkKey,
  });

  const linkContent = (
    <span className="cursor-pointer underline decoration-emerald-600 decoration-3 underline-offset-4">
      {textContent}
    </span>
  );

  if (!article) return linkContent;

  return (
    <>
      <Tooltip>
        <TooltipTrigger>
          <Link
            to="/wikis/$wikiKey/$articleKey"
            params={{ articleKey: article.key, wikiKey: article.wikiKey }}
            target="_blank"
          >
            {linkContent}
          </Link>
        </TooltipTrigger>
        <TooltipContent className="h-2xs w-2xs">
          <p className="pt-3 text-slate-400">Wiki</p>
          <p className="py-3 text-lg font-semibold text-emerald-600 capitalize">
            {article.title}
          </p>
          <img src={article.image} className="rounded object-scale-down" />
          <RichText
            editable={false}
            initialState={article.content as unknown as SerializedEditorState}
            editorNodes={[WikiNode]}
          />
        </TooltipContent>
      </Tooltip>
    </>
  );
};
