import { Toolbar } from "@/design-system/components/toolbar";
import { ConfirmDialog } from "@/design-system/components";
import { Button, Input } from "@/design-system/primitives";
import { ScrollArea } from "@/design-system/primitives/scroll-area";
import { HomeIcon, PlusIcon, SearchIcon, Trash2Icon } from "lucide-react";
import { useWikiStore } from "./hooks/use-wiki-store";
import { useDeleteArticle } from "./hooks/use-delete-article";
import { WikiSection } from "@/domains/wiki/types";
import { Link, useParams } from "@tanstack/react-router";
import { cn } from "@/lib/style";
import { AddCategoryPopover } from "./add-category-popover";
import { CategoryBadge } from "./category-badge";
import { CategoryActionsDropdown } from "./category-actions-dropdown";
import { useState, useEffect } from "react";

const ArticleTitle = ({
  title,
  articleKey,
  canDelete,
}: {
  title: string;
  articleKey: string;
  canDelete: boolean;
}) => {
  const wikiKey = useWikiStore((state) => state.wikiData.wiki.key);
  const { articleKey: selectedArticleKey } = useParams({ strict: false });
  const isSelected = selectedArticleKey === articleKey;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [linkCount, setLinkCount] = useState<number | null>(null);
  const { deleteArticle, getArticleLinkCount } = useDeleteArticle();

  useEffect(() => {
    if (deleteDialogOpen) {
      getArticleLinkCount(articleKey).then(setLinkCount);
    }
  }, [deleteDialogOpen, articleKey, getArticleLinkCount]);

  const handleDelete = async () => {
    await deleteArticle(articleKey);
    setDeleteDialogOpen(false);
  };

  const getDeleteDescription = () => {
    if (linkCount === null) {
      return "Loading...";
    }
    if (linkCount > 0) {
      return `Are you sure you want to delete this article? This article is referenced by ${linkCount} scene(s). All references will also be deleted. This action cannot be undone.`;
    }
    return "Are you sure you want to delete this article? This action cannot be undone.";
  };

  return (
    <>
      <div className="group/article flex items-center justify-between">
        <Link
          to="/wikis/$wikiKey/$articleKey"
          params={{ articleKey, wikiKey }}
          className="min-w-0 flex-1"
        >
          <p
            className={cn(
              isSelected && "bg-accent font-semibold",
              "hover:bg-accent text-md w-full truncate rounded py-1 pl-6",
            )}
          >
            {title}
          </p>
        </Link>
        {canDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDeleteDialogOpen(true);
            }}
            className="invisible h-6 w-6 flex-shrink-0 cursor-pointer transition-transform ease-in-out group-hover/article:visible hover:scale-105"
          >
            <Trash2Icon size={14} className="text-destructive" />
          </Button>
        )}
      </div>

      <ConfirmDialog
        title="Delete article?"
        description={getDeleteDescription()}
        confirmLabel="Delete"
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </>
  );
};

const Section = ({ category, articles }: WikiSection) => {
  const { wikiKey, canDeleteCategory, canDeleteArticle } = useWikiStore(
    (state) => ({
      wikiKey: state.wikiData.wiki.key,
      canDeleteCategory: state.permissions.canDeleteCategory,
      canDeleteArticle: state.permissions.canDeleteArticle,
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
            canDelete={canDeleteArticle}
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
