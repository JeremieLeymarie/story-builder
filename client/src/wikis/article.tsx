import { Button, Card } from "@/design-system/primitives";
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
      {/* Hero Section */}
      <div className="from-muted/30 to-background border-b bg-gradient-to-b">
        <div className="mx-auto max-w-5xl px-8 py-12">
          <div className="relative mb-6">
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
            <span className="text-muted-foreground">·</span>
            <p className="text-muted-foreground text-sm">
              Last edited {article.updatedAt.toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-8 py-12">
        <div className="space-y-12">
          {/* Image Section */}
          {article.image && (
            <Card className="mx-auto max-w-xl overflow-hidden border-0 shadow-xl">
              <img
                src={article.image}
                alt={article.title}
                className="h-auto w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </Card>
          )}

          {/* Content Section */}
          <article className="prose prose-lg mx-auto max-w-[65ch]">
            <EditorContextProvider
              entityType="wiki-article"
              entityKey={article.key}
            >
              <RichText
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
