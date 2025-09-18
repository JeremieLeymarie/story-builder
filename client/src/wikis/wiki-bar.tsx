import { Title } from "@/design-system/components";
import { Toolbar } from "@/design-system/components/toolbar";
import { Input } from "@/design-system/primitives";
import { ScrollArea } from "@/design-system/primitives/scroll-area";
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import { useWikiStore } from "./hooks/use-wiki-store";
import { WikiSection } from "@/domains/wiki/types";
import { Link, useParams } from "@tanstack/react-router";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/design-system/primitives/tooltip";
import { cn } from "@/lib/style";

const ArticleTitle = ({
  title,
  articleKey,
}: {
  title: string;
  articleKey: string;
}) => {
  const wikiKey = useWikiStore((state) => state.wikiData.wiki.key);
  const { articleKey: selectedArticleKey } = useParams({ strict: false });
  const isSelected = selectedArticleKey === articleKey;

  return (
    <Link to="/wikis/$wikiKey/$articleKey" params={{ articleKey, wikiKey }}>
      <p
        className={cn(
          isSelected && "bg-accent font-semibold",
          "hover:bg-accent text-md w-full truncate rounded py-1 pl-2",
        )}
      >
        {title}
      </p>
    </Link>
  );
};

const Section = ({ category, articles }: WikiSection) => {
  const wikiKey = useWikiStore((state) => state.wikiData.wiki.key);

  return (
    <div className="my-2">
      <div className="flex items-center gap-2">
        <Title variant="sub-section">{category?.name ?? "Other"}</Title>
        <Tooltip>
          <TooltipTrigger>
            <Link to="/wikis/$wikiKey/new" params={{ wikiKey }}>
              <PlusCircleIcon
                size={18}
                className="text-primary cursor-pointer transition-transform ease-in-out hover:scale-105"
              />
            </Link>
          </TooltipTrigger>
          <TooltipContent>Create an article in this category</TooltipContent>
        </Tooltip>
      </div>
      <div className="mt-1">
        {articles.map(({ key, title }) => (
          <ArticleTitle key={key} title={title} articleKey={key} />
        ))}
      </div>
    </div>
  );
};

export const WikiBar = () => {
  const {
    sections,
    wiki: { key: wikiKey },
  } = useWikiStore((state) => state.wikiData);

  return (
    <Toolbar className="w-[300px] space-y-3">
      <div className="relative">
        <SearchIcon className="text-muted-foreground absolute top-2.5 left-2 h-4" />
        <Input placeholder="Search" className="pl-9" />
      </div>

      {/* Apparently display grid is needed in order for the scroll area to work with a max-height instead of hard-coded height?? */}
      <div className="grid">
        <ScrollArea className="flex max-h-[calc(100dvh-175px)]">
          <Link
            to="/wikis/$wikiKey"
            params={{ wikiKey }}
            className="my-2 block"
          >
            <Title variant="sub-section" className="flex items-center gap-2">
              Home
            </Title>
          </Link>
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
