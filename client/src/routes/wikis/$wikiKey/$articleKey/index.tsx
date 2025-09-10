import { BackdropLoader, ErrorMessage } from "@/design-system/components";
import { WikiProvider } from "@/wikis/hooks/use-wiki-store";
import { createFileRoute } from "@tanstack/react-router";
import { Article } from "@/wikis/article";
import { WikiContainer } from "@/wikis/wiki-container";
import { useArticleData } from "../-hooks/use-article-data";
import { useWikiQueries } from "../-hooks/use-wiki-queries";

const RouteComponent = () => {
  const { articleKey, wikiKey } = Route.useParams();
  const {
    wikiData,
    permissions,
    isLoading: isWikiLoading,
    refetch: refetchWikiData,
  } = useWikiQueries({ wikiKey });
  const {
    articleData,
    isLoading: isArticleLoading,
    refetch: refetchArticle,
  } = useArticleData({ articleKey });

  if (isWikiLoading || isArticleLoading) return <BackdropLoader />;

  if (!articleData || !wikiData || !permissions) return <ErrorMessage />;

  // TODO: use a better heuristic to get category data
  const section = wikiData.sections.find((section) =>
    section.articles.some((article) => article.key === articleKey),
  );

  return (
    <WikiProvider
      refresh={async () => {
        await refetchWikiData();
        await refetchArticle();
      }}
      wikiData={wikiData}
      permissions={permissions}
    >
      <WikiContainer>
        <Article article={articleData} category={section?.category ?? null} />
      </WikiContainer>
    </WikiProvider>
  );
};

export const Route = createFileRoute("/wikis/$wikiKey/$articleKey/")({
  component: RouteComponent,
});
