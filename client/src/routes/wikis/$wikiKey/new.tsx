import { createFileRoute, Link } from "@tanstack/react-router";
import { WikiProvider } from "@/wikis/hooks/use-wiki-store";
import { BackdropLoader, ErrorMessage } from "@/design-system/components";
import { ArticleEditor } from "@/wikis/article-editor";
import { WikiContainer } from "@/wikis/wiki-container";
import { useWikiQueries } from "./-hooks/use-wiki-queries";
import { Button } from "@/design-system/primitives";

const RouteComponent = () => {
  const { wikiKey } = Route.useParams();
  const { wikiData, permissions, refetch, isLoading } = useWikiQueries({
    wikiKey,
  });

  if (isLoading) return <BackdropLoader />;

  if (!wikiData || !permissions) return <ErrorMessage />;

  if (!permissions.canCreateArticle()) {
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
        await refetch();
      }}
      wikiData={wikiData}
      permissions={permissions}
    >
      <WikiContainer>
        <ArticleEditor mode="create" />
      </WikiContainer>
    </WikiProvider>
  );
};

export const Route = createFileRoute("/wikis/$wikiKey/new")({
  component: RouteComponent,
});
