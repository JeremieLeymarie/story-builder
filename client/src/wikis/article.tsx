import { Title } from "@/design-system/components";
import { Button } from "@/design-system/primitives";
import { WikiArticle } from "@/lib/storage/domain";
import { Link } from "@tanstack/react-router";
import { PencilIcon } from "lucide-react";
import { useWikiStore } from "./hooks/use-wiki-store";
import { WikiDataCategory } from "@/domains/wiki/types";
import { RichText } from "@/design-system/components/editor/components/rich-text-editor";
import { CategoryBadge } from "./category-badge";

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
            <CategoryBadge color={category?.color} name={category?.name} />
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
        <RichText initialState={article.content} editable={false} />
      </article>
    </div>
  );
};
