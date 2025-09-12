import { Title } from "@/design-system/components";
import { Toolbar } from "@/design-system/components/toolbar";
import { Input } from "@/design-system/primitives";
import { ScrollArea } from "@/design-system/primitives/scroll-area";
import { PlusCircleIcon, PlusIcon, SearchIcon } from "lucide-react";
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

const SectionTitle = ({ title, color }: { title: string; color: string }) => {
  return <CategoryBadge color={color}>{title}</CategoryBadge>;
};

const Section = ({ category, articles }: WikiSection) => {
  const wikiKey = useWikiStore((state) => state.wikiData.wiki.key);

  return (
    <div className="group my-2">
      <div className="flex items-center justify-between">
        <SectionTitle
          title={category?.name ?? "Other"}
          color={category?.color ?? "#80ed99"}
        />
        <Tooltip>
          <TooltipTrigger>
            <Link to="/wikis/$wikiKey/new" params={{ wikiKey }}>
              <PlusCircleIcon
                size={20}
                className="text-primary invisible cursor-pointer transition-transform ease-in-out group-hover:visible hover:scale-105"
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
          <AddCategoryPopover
            trigger={
              <Title
                className="text-muted-foreground text-md flex items-center gap-2 font-semibold decoration-dashed"
                variant="sub-section"
              >
                New category <PlusIcon className="cursor-pointer" size={20} />
              </Title>
            }
          />
          <Link
            to="/wikis/$wikiKey"
            params={{ wikiKey }}
            className="my-2 block"
          >
            <SectionTitle title="Home" color="#ffffff" />
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
