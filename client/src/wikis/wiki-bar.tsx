import { Title } from "@/design-system/components";
import { Toolbar } from "@/design-system/components/toolbar";
import { Input } from "@/design-system/primitives";
import { ScrollArea } from "@/design-system/primitives/scroll-area";
import { SearchIcon } from "lucide-react";
import { useWikiStore } from "./hooks/use-wiki-store";
import { WikiSection } from "@/domains/wiki/types";
import { Link } from "@tanstack/react-router";

const ArticleTitle = ({
  title,
  articleKey,
}: {
  title: string;
  articleKey: string;
}) => {
  const wikiKey = useWikiStore((state) => state.wikiData.wiki.key);

  return (
    <Link to="/wikis/$wikiKey/$articleKey" params={{ articleKey, wikiKey }}>
      <p className="hover:bg-accent text-md w-full truncate rounded py-1 pl-2">
        {title}
      </p>
    </Link>
  );
};

const Section = ({ category, articles }: WikiSection) => {
  return (
    <div>
      <Title variant="sub-section">{category?.name ?? "Other"}</Title>
      <div className="mt-1">
        {articles.map(({ key, title }) => (
          <ArticleTitle key={key} title={title} articleKey={key} />
        ))}
      </div>
    </div>
  );
};

export const WikiBar = () => {
  const { sections } = useWikiStore((state) => state.wikiData);

  return (
    <Toolbar className="w-[300px] space-y-3">
      <div className="relative">
        <SearchIcon className="text-muted-foreground absolute top-2.5 left-2 h-4" />
        <Input placeholder="Search" className="pl-9" />
      </div>

      <div className="grid">
        <ScrollArea className="max-h-[calc(100dvh-175px)]">
          {sections.map(({ category, articles }) => (
            <Section
              key={category?.key ?? "other"}
              category={category}
              articles={articles}
            />
          ))}
        </ScrollArea>
      </div>
    </Toolbar>
  );
};
