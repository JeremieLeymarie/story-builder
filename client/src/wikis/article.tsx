import { Button } from "@/design-system/primitives";
import { WikiArticle } from "@/lib/storage/domain";
import { Link } from "@tanstack/react-router";
import { PencilIcon } from "lucide-react";
import { useWikiStore } from "./hooks/use-wiki-store";
import { WikiDataCategory } from "@/domains/wiki/types";
import { RichText } from "@/design-system/components/editor/components/rich-text-editor";
import { CategoryBadge } from "./category-badge";
import { EditorContextProvider } from "@/design-system/components/editor/hooks/use-editor-context";

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
    <div className="min-h-screen w-full">
      <div className="from-muted/30 to-background border-b bg-linear-to-b">
        <div className="mx-auto px-8 pt-8 pb-6">
          <div className="relative mb-3">
            <h1 className="text-5xl font-bold tracking-tight">
              {article.title}
            </h1>
            {canEdit && (
              <Link
                to="/wikis/$wikiKey/$articleKey/edit"
                params={{ articleKey: article.key, wikiKey: article.wikiKey }}
                className="absolute top-0 right-0"
              >
                <Button variant="outline" className="gap-2">
                  <PencilIcon size={16} />
                  Edit
                </Button>
              </Link>
            )}
          </div>
          <div className="flex items-center gap-4">
            <CategoryBadge color={category?.color} name={category?.name} />
            <p className="text-muted-foreground text-sm">
              Last edited {article.updatedAt.toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl px-8 py-12">
        <div className="space-y-12">
          <img
            src={article.image}
            alt={article.title}
            className="mx-auto max-h-85 rounded-xl object-cover"
          />

          <article className="prose prose-lg mx-auto">
            <EditorContextProvider
              entityType="wiki-article"
              entityKey={article.key}
            >
              <RichText
                key={JSON.stringify(article.content)}
                initialState={article.content}
                editable={false}
                textDisplayMode="full"
              />
            </EditorContextProvider>
          </article>
        </div>
      </div>
    </div>
  );
};
