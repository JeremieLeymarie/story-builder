import { Title } from "@/design-system/components";
import { useWikiStore } from "./hooks/use-wiki-store";
import { Button } from "@/design-system/primitives";
import { Link } from "@tanstack/react-router";

export const WikiHome = () => {
  const [wikiData, permissions] = useWikiStore((state) => [
    state.wikiData,
    state.permissions,
  ]);

  const isWikiEmpty = wikiData.sections.every(
    (section) => section.articles.length === 0,
  );

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-8/12 flex-col items-center justify-center space-y-2 lg:w-6/12">
        <img src={wikiData.wiki.image} className="w-full rounded shadow" />
        <Title variant="primary" className="bg-transparent">
          Welcome to the{" "}
          <span className="text-primary">{wikiData.wiki.name}</span> wiki
        </Title>
        <p className="text-muted-foreground italic">
          {isWikiEmpty
            ? "This wiki is empty..."
            : "Select an article in the bar on the left"}
        </p>
        {permissions.canCreateArticle && (
          <Link
            to="/wikis/$wikiKey/new"
            params={{ wikiKey: wikiData.wiki.key }}
          >
            <Button>Create {isWikiEmpty ? "a first" : "a new"} article</Button>
          </Link>
        )}
      </div>
    </div>
  );
};
