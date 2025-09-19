import { Toolbar } from "@/design-system/components/toolbar";
import { Button, Input } from "@/design-system/primitives";
import { ScrollArea } from "@/design-system/primitives/scroll-area";
import { HomeIcon, PlusIcon, SearchIcon } from "lucide-react";
import { useWikiStore } from "./hooks/use-wiki-store";
import { WikiSection } from "@/domains/wiki/types";
import { Link, useParams } from "@tanstack/react-router";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/design-system/primitives/tooltip";
import { cn } from "@/lib/style";
import { AddCategoryPopover } from "./add-category-popover";
import { CategoryBadge } from "./category-badge";

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
          "hover:bg-accent text-md w-full truncate rounded py-1 pl-6",
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
    <div className="group my-2">
      <div className="flex items-center justify-between">
        <CategoryBadge color={category?.color} name={category?.name} />
        <Tooltip>
          <TooltipTrigger>
            <Link to="/wikis/$wikiKey/new" params={{ wikiKey }}>
              <PlusIcon
                size={18}
                className="invisible cursor-pointer transition-transform ease-in-out group-hover:visible hover:scale-105"
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
    <Toolbar className="w-[300px] space-y-1">
      <div className="relative">
        <SearchIcon className="text-muted-foreground absolute top-2.5 left-2 h-4" />
        <Input placeholder="Search" className="pl-9" />
        <AddCategoryPopover
          trigger={
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground mt-1 flex items-center gap-2 text-xs"
            >
              New category <PlusIcon className="cursor-pointer" size={14} />
            </Button>
          }
        />
      </div>

      {/* Apparently display grid is needed in order for the scroll area to work with a max-height instead of hard-coded height?? */}
      <div className="grid">
        <ScrollArea className="flex max-h-[calc(100dvh-175px)]">
          <Link
            to="/wikis/$wikiKey"
            params={{ wikiKey }}
            className="my-2 block"
          >
            <div className="flex w-max items-center gap-1 rounded-lg py-0.5">
              <HomeIcon size={18} /> Home
            </div>
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
