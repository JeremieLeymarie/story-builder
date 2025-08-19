import { createFileRoute } from "@tanstack/react-router";

const RouteComponent = () => {
  const { wikiKey } = Route.useParams();

  return <div>TODO: Wiki page {wikiKey}</div>;
};

export const Route = createFileRoute("/wikis/$wikiKey")({
  component: RouteComponent,
});
