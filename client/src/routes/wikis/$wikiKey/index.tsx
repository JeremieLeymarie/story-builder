import { BackdropLoader, ErrorMessage } from "@/design-system/components";
import { WikiProvider } from "@/wikis/hooks/use-wiki-store";
import { createFileRoute } from "@tanstack/react-router";
import { ArticleEmptyState } from "@/wikis/article-empty-state";
import { WikiContainer } from "@/wikis/wiki-container";
import { useWikiQueries } from "./-hooks/use-wiki-queries";

const RouteComponent = () => {
  const { wikiKey } = Route.useParams();
  const { wikiData, permissions, isLoading, refetch } = useWikiQueries({
    wikiKey,
  });

  if (isLoading) return <BackdropLoader />;

  if (!wikiData || !permissions) return <ErrorMessage />;

  return (
    <WikiProvider
      refresh={async () => {
        await refetch();
      }}
      wikiData={wikiData}
      permissions={permissions}
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
