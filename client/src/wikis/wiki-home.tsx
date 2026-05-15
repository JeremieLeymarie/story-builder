import { Title } from "@/design-system/components";
import { useWikiStore } from "./hooks/use-wiki-store";
import { Button } from "@/design-system/primitives";
import { Link } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";

export const WikiHome = () => {
  const [wikiData, permissions] = useWikiStore((state) => [
    state.wikiData,
    state.permissions,
  ]);

  const isWikiEmpty = wikiData.sections.every(
    (section) => section.articles.length === 0,
  );

  return (
    <div className="flex h-full w-full justify-center">
      <div className="mt-12 flex w-8/12 flex-col items-center space-y-2 lg:w-6/12">
        <img
          src={wikiData.wiki.image}
          className="mx-auto max-h-[50%] rounded-xl shadow"
        />
        <Title variant="primary" className="bg-transparent">
          <span>Welcome to</span>{" "}
          <span className="text-primary">{wikiData.wiki.name}</span>
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
            search={{ categoryKey: undefined }}
          >
            <span className="text-muted-foreground mx-2 italic">or</span>
            <Button size="lg">
              <PlusIcon className="mr-2 h-6 w-6" />
              Create {isWikiEmpty ? "a first" : "a new"} article
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
