import { BackdropLoader, ErrorMessage } from "@/design-system/components";
import { getWikiService } from "@/domains/wiki/wiki-service";
import { WikiContent } from "@/wikis/wiki";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

const RouteComponent = () => {
  const { wikiKey } = Route.useParams();
  const svc = getWikiService();
  const {
    data: wiki,
    isLoading,
    refetch,
  } = useQuery({
    queryFn: async () => svc.getWikiData(wikiKey),
    queryKey: ["wiki-data", wikiKey],
    refetchOnWindowFocus: false,
  });

  if (isLoading || !wiki) return <BackdropLoader />;

  if (!wiki) return <ErrorMessage />;

  return (
    <WikiContent
      wiki={wiki}
      refresh={() => {
        refetch();
      }}
    />
  );
};

export const Route = createFileRoute("/wikis/$wikiKey")({
  component: RouteComponent,
});
