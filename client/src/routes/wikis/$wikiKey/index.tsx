import { BackdropLoader, ErrorMessage } from "@/design-system/components";
import { WikiProvider } from "@/wikis/hooks/use-wiki-store";
import { createFileRoute } from "@tanstack/react-router";
import { WikiContainer } from "@/wikis/wiki-container";
import { useWikiQueries } from "./-hooks/use-wiki-queries";
import { WikiHome } from "@/wikis/wiki-home";

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
        <WikiHome />
      </WikiContainer>
    </WikiProvider>
  );
};

export const Route = createFileRoute("/wikis/$wikiKey/")({
  component: RouteComponent,
});
