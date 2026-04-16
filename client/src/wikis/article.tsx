import { Title } from "@/design-system/components";
import { Button } from "@/design-system/primitives";
import { WikiArticle } from "@/lib/storage/domain";
import { Link } from "@tanstack/react-router";
import { SquarePenIcon, Quote } from "lucide-react";
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
    <div className="flex flex-col items-center">
      <div className="flex w-full max-w-4xl flex-col items-center space-y-4">
        <div className="bg-muted/20 w-full space-y-2 rounded-lg p-6 text-center">
          <div className="relative flex items-center justify-center">
            <Title variant="article" className="text-black">
              {article.title}
            </Title>
            {canEdit && (
              <Link
                to="/wikis/$wikiKey/$articleKey/edit"
                params={{ articleKey: article.key, wikiKey: article.wikiKey }}
                className="absolute right-0"
              >
                <Button className="gap-2">
                  <SquarePenIcon />
                  Edit
                </Button>
              </Link>
            )}
          </div>
          <div className="flex items-center justify-center gap-4">
            <CategoryBadge color={category?.color} name={category?.name} />
            <p className="text-muted-foreground text-sm">
              Last edited on {article.updatedAt.toLocaleDateString()}, at{" "}
              {article.updatedAt.toLocaleTimeString()}
            </p>
          </div>
        </div>
        <img
          src={article.image}
          className="mb-[7%] w-[500px] rounded-xl shadow-lg"
        />
      </div>
      <article className="relative w-full max-w-4xl pt-16 pb-8">
        <Quote
          className="absolute opacity-40"
          size={48}
          style={{
            color: category?.color || "#000",
            top: "-1%",
            left: "-7%",
          }}
        />
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
        <Quote
          className="absolute rotate-180 opacity-40"
          size={48}
          style={{
            color: category?.color || "#000",
            top: "95%",
            left: "101%",
          }}
        />
      </article>
    </div>
  );
};
