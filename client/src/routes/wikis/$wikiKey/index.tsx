import { BackdropLoader, ErrorMessage } from "@/design-system/components";
import { WikiProvider } from "@/wikis/hooks/use-wiki-store";
import { createFileRoute } from "@tanstack/react-router";
import { useWikiData } from "./-hooks/use-wiki-data";
import { ArticleEmptyState } from "@/wikis/article-empty-state";
import { WikiContainer } from "@/wikis/wiki-container";

const RouteComponent = () => {
  const { wikiKey } = Route.useParams();
  const { isLoading, refetch, wikiData } = useWikiData({ wikiKey });

  if (isLoading || !wikiData) return <BackdropLoader />;

  if (!wikiData) return <ErrorMessage />;

  return (
    <WikiProvider
      refresh={async () => {
        await refetch();
      }}
      wikiData={wikiData}
    >
      <WikiContainer>
        <ArticleEmptyState />
      </WikiContainer>
    </WikiProvider>
  );
};

export const Route = createFileRoute("/wikis/$wikiKey/")({
  component: RouteComponent,
});
