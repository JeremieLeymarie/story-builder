import { Toolbar } from "@/design-system/components/toolbar";
import { ConfirmDialog } from "@/design-system/components";
import { Button } from "@/design-system/primitives";
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
import { useDeleteArticle } from "./hooks/use-delete-article";
import { Separator } from "@/design-system/primitives/separator";
import { Kbd } from "@/design-system/primitives/kbd";
import { getUserOS } from "@/lib/get-os";

const ArticleTitle = ({
  title,
  articleKey,
}: {
  title: string;
  articleKey: string;
  canDelete: boolean;
}) => {
  const wikiKey = useWikiStore((state) => state.wikiData.wiki.key);
  const { articleKey: selectedArticleKey } = useParams({ strict: false });
  const isSelected = selectedArticleKey === articleKey;
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { deleteArticle } = useDeleteArticle();

  return (
    <div
      onClick={() =>
        navigate({
          to: "/wikis/$wikiKey/$articleKey",
          params: { articleKey, wikiKey },
        })
      }
      className={cn(
        isSelected && "bg-accent/80 font-semibold",
        "hover:bg-accent/50 group/article flex cursor-pointer items-center justify-between rounded-xl py-1 pr-3 pl-8 transition-all duration-200",
      )}
    >
      <p className="text-md w-full truncate">{title}</p>
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
          deleteArticle(articleKey);
        }}
        onCancel={(e) => {
          e.stopPropagation();
        }}
        open={open}
        setOpen={setOpen}
        trigger={
          <Button
            size="icon-xs"
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
    <div className="group mb-2">
      <div className="mb-2 flex items-center justify-between">
        <CategoryBadge color={category?.color} name={category?.name} />
        {category && (
          <CategoryActionsDropdown
            category={category}
            wikiKey={wikiKey}
            canDelete={canDeleteCategory}
          />
        )}
      </div>
      <div className="space-y-0.5">
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
  const [wikiData, openSearch] = useWikiStore((state) => [
    state.wikiData,
    state.openSearch,
  ]);
  const {
    sections,
    wiki: { key: wikiKey },
  } = wikiData;

  const os = getUserOS();

  return (
    <Toolbar className="sticky top-[calc(var(--spacing)*4+var(--navbar-height)+2px)] h-max w-80 space-y-1">
      <div className="relative flex flex-col items-start gap-1">
        <Button
          variant="outline"
          className="w-full justify-between"
          onClick={openSearch}
        >
          <div className="flex items-center gap-2">
            <SearchIcon />
            <span>Search</span>
          </div>
          <Kbd>{os === "Mac" ? "⌘" : "Ctrl"} + K</Kbd>
        </Button>
        <AddCategoryPopover
          trigger={
            <Button variant="secondary" size="sm">
              New category <PlusIcon className="cursor-pointer" size={14} />
            </Button>
          }
        />
        <Separator />

        <Link to="/wikis/$wikiKey" params={{ wikiKey }} className="mb-2 block">
          <Button variant="ghost" size="lg">
            <HomeIcon size={18} />
            Home
          </Button>
        </Link>
      </div>
      <ScrollArea scrollbarClassName="-mr-2.5">
        <div className="max-h-[calc(100dvh-275px)]">
          {sections.map(({ category, articles }) => (
            <Section
              key={category?.key ?? "other"}
              category={category}
              articles={articles}
            />
          ))}
        </div>
      </ScrollArea>
    </Toolbar>
  );
};
