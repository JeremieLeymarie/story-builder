import { BackdropLoader, ErrorMessage } from "@/design-system/components";
import { ArticleEditor } from "@/wikis/article-editor";
import { WikiProvider } from "@/wikis/hooks/use-wiki-store";
import { WikiContainer } from "@/wikis/wiki-container";
import { createFileRoute } from "@tanstack/react-router";
import { useWikiData } from "../-hooks/use-wiki-data";
import { useArticleData } from "../-hooks/use-article-data";

function RouteComponent() {
  const { articleKey, wikiKey } = Route.useParams();
  const {
    wikiData,
    isLoading: isWikiDataLoading,
    refetch: refetchWikiData,
  } = useWikiData({ wikiKey });
  const {
    articleData,
    isLoading: isArticleLoading,
    refetch: refetchArticle,
  } = useArticleData({ articleKey });

  if (isWikiDataLoading || isArticleLoading) return <BackdropLoader />;

  if (!articleData || !wikiData) return <ErrorMessage />;

  return (
    <WikiProvider
      refresh={async () => {
        await refetchWikiData();
        await refetchArticle();
      }}
      wikiData={wikiData}
    >
      <WikiContainer>
        <ArticleEditor
          mode="update"
          defaultValues={{
            title: articleData.title,
            content: articleData.content,
            image: articleData.image,
            categoryKey: articleData.categoryKey,
          }}
          articleKey={articleData.key}
        />
      </WikiContainer>
    </WikiProvider>
  );
}

export const Route = createFileRoute("/wikis/$wikiKey/$articleKey/edit")({
  component: RouteComponent,
});
