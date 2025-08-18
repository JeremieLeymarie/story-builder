import { BackdropLoader, ErrorMessage } from "@/design-system/components";
import { getWikiService } from "@/domains/wiki/wiki-service";
import { WikiList } from "@/wikis/wiki-list";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

const RouteComponent = () => {
  const { data: wikis } = useQuery({
    queryKey: ["WIKIS"],
    queryFn: async () => (await getWikiService()).getAllWikis(),
  });

  if (wikis === undefined) return <BackdropLoader />;

  return wikis ? (
    <WikiList wikis={wikis} />
  ) : (
    <ErrorMessage>Could not get wikis</ErrorMessage>
  );
};

export const Route = createFileRoute("/wikis/")({
  component: RouteComponent,
});
