import { Toolbar } from "@/design-system/components/toolbar";
import { ConfirmDialog } from "@/design-system/components";
import { Button, Input } from "@/design-system/primitives";
import { ScrollArea } from "@/design-system/primitives/scroll-area";
import { HomeIcon, PlusIcon, SearchIcon, Trash2Icon } from "lucide-react";
import { useWikiStore } from "./hooks/use-wiki-store";
import { WikiSection } from "@/domains/wiki/types";
import { cn } from "@/lib/style";
import { AddCategoryPopover } from "./add-category-popover";
import { CategoryBadge } from "./category-badge";
import { CategoryActionsDropdown } from "./category-actions-dropdown";
import { useState } from "react";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { getWikiService } from "@/domains/wiki/wiki-service";

const ArticleTitle = ({
  title,
  articleKey,
}: {
  title: string;
  articleKey: string;
  canDelete: boolean;
}) => {
  const [wikiKey, refresh] = useWikiStore((state) => [
    state.wikiData.wiki.key,
    state.refresh,
  ]);
  const { articleKey: selectedArticleKey } = useParams({ strict: false });
  const isSelected = selectedArticleKey === articleKey;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const wikiService = getWikiService();

  return (
    <div
      onClick={() =>
        navigate({
          to: "/wikis/$wikiKey/$articleKey",
          params: { articleKey, wikiKey },
        })
      }
      className={cn(
        isSelected && "bg-accent font-semibold",
        "hover:bg-accent group/article flex items-center justify-between rounded",
      )}
    >
      <p className="text-md w-full truncate py-1 pl-6">{title}</p>
      <ConfirmDialog
        title="Are you sure?"
        description={
          <div>
            Do want to delete <span className="font-semibold">{title}</span>{" "}
            from the wiki? Deletion is definitive, and links to this article in
            scenes will also be deleted.
          </div>
        }
        confirmLabel="Delete"
        onConfirm={async (e) => {
          e.stopPropagation();
          await wikiService.removeArticle(articleKey);
          refresh();
        }}
        onCancel={(e) => {
          e.stopPropagation();
        }}
        open={open}
        setOpen={setOpen}
        trigger={
          <Button
            size="xs"
            variant="ghost"
            className="invisible cursor-pointer group-hover/article:visible"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Trash2Icon />
          </Button>
        }
      />
    </div>
  );
};

const Section = ({ category, articles }: WikiSection) => {
  const { wikiKey, canDeleteCategory, canRemoveArticle } = useWikiStore(
    (state) => ({
      wikiKey: state.wikiData.wiki.key,
      canDeleteCategory: state.permissions.canDeleteCategory,
      canRemoveArticle: state.permissions.canRemoveArticle,
    }),
  );

  return (
    <div className="group my-2">
      <div className="flex items-center justify-between">
        <CategoryBadge color={category?.color} name={category?.name} />
        {category && (
          <CategoryActionsDropdown
            category={category}
            wikiKey={wikiKey}
            canDelete={canDeleteCategory}
          />
        )}
      </div>
      <div className="mt-1">
        {articles.map(({ key, title }) => (
          <ArticleTitle
            key={key}
            title={title}
            articleKey={key}
            canDelete={canRemoveArticle}
          />
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
