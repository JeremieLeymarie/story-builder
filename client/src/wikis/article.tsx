import { Title } from "@/design-system/components";
import { Button } from "@/design-system/primitives";
import { Badge } from "@/design-system/primitives/badge";
import { WikiArticle } from "@/lib/storage/domain";
import { Link } from "@tanstack/react-router";
import { PencilIcon } from "lucide-react";
import { useWikiStore } from "./hooks/use-wiki-store";
import { RichText } from "@/design-system/components/editor/blocks/rich-text-editor";
import { WikiDataCategory } from "@/domains/wiki/types";

export const Article = ({
  article,
  category,
}: {
  article: WikiArticle;
  category: WikiDataCategory | null;
}) => {
  const { canEditArticle: canEdit } = useWikiStore(
    (state) => state.permissions,
  );

  return (
    <div>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Title variant="article">{article.title}</Title>
            {canEdit && (
              <Link
                to="/wikis/$wikiKey/$articleKey/edit"
                params={{ articleKey: article.key, wikiKey: article.wikiKey }}
              >
                <Button className="gap-2" size="sm">
                  <PencilIcon />
                  Edit
                </Button>
              </Link>
            )}
          </div>
          <div className="flex items-center gap-4">
            {category ? (
              <Badge>{category.name} </Badge>
            ) : (
              <span className="font-semibold">No category</span>
            )}
            <p className="text-muted-foreground text-sm">
              Last edited on {article.updatedAt.toLocaleDateString()}, at{" "}
              {article.updatedAt.toLocaleTimeString()}
            </p>
          </div>
        </div>
        <img
          src={article.image}
          className="border-primary w-[500px] rounded border-3 shadow-lg"
        />
      </div>
      <article>
        <RichText
          initialState={article.content}
          editable={false}
          textDisplayMode="full"
        />
      </article>
    </div>
  );
};
