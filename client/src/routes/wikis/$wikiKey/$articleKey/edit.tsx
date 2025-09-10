import { BackdropLoader, ErrorMessage } from "@/design-system/components";
import { ArticleEditor } from "@/wikis/article-editor";
import { WikiProvider } from "@/wikis/hooks/use-wiki-store";
import { WikiContainer } from "@/wikis/wiki-container";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useArticleData } from "../-hooks/use-article-data";
import { useWikiQueries } from "../-hooks/use-wiki-queries";
import { Button } from "@/design-system/primitives";

function RouteComponent() {
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

  if (!permissions.canEditArticle()) {
    return (
      <ErrorMessage className="flex flex-col gap-2">
        You don't have permission to create article in this wiki...
        <Link to="/wikis/$wikiKey" params={{ wikiKey }}>
          <Button size="sm" variant="link">
            Go back to wiki home page
          </Button>
        </Link>
      </ErrorMessage>
    );
  }

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
