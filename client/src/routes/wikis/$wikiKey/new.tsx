import { createFileRoute } from "@tanstack/react-router";
import { useWikiData } from "./-hooks/use-wiki-data";
import { WikiProvider } from "@/wikis/hooks/use-wiki-store";
import { BackdropLoader, ErrorMessage } from "@/design-system/components";
import { ArticleEditor } from "@/wikis/article-editor";
import { WikiContainer } from "@/wikis/wiki-container";

const RouteComponent = () => {
  const { wikiKey } = Route.useParams();
  const { wikiData, refetch, isLoading } = useWikiData({ wikiKey });

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
        <ArticleEditor mode="create" />
      </WikiContainer>
    </WikiProvider>
  );
};

export const Route = createFileRoute("/wikis/$wikiKey/new")({
  component: RouteComponent,
});
