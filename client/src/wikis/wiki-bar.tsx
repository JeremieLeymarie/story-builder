import { Toolbar } from "@/design-system/components/toolbar";
import { ConfirmDialog } from "@/design-system/components";
import { Button } from "@/design-system/primitives";
import { Input } from "@/design-system/primitives/input";
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
        isSelected && "bg-accent/80 font-semibold shadow-sm",
        "hover:bg-accent/50 group/article ml-6 flex cursor-pointer items-center justify-between rounded-md px-3 py-2 transition-all duration-200",
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
    <div className="group mb-6">
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
  const wikiData = useWikiStore((state) => state.wikiData);
  const {
    sections,
    wiki: { key: wikiKey },
  } = wikiData;

  return (
    <Toolbar className="sticky top-20 w-[300px] space-y-4 self-start">
      <div className="space-y-3">
        <div className="relative">
          <SearchIcon className="text-muted-foreground absolute top-2.5 left-2 h-4" />
          <Input placeholder="Search articles..." className="pl-9" />
        </div>
        <AddCategoryPopover
          trigger={
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground w-full justify-start gap-2 text-sm"
            >
              <PlusIcon size={16} />
              New category
            </Button>
          }
        />
      </div>

      <div className="border-t pt-4">
        <Link to="/wikis/$wikiKey" params={{ wikiKey }} className="mb-4 block">
          <div className="hover:bg-accent flex items-center gap-2 rounded-md px-3 py-2 font-medium transition-colors">
            <HomeIcon size={18} />
            Home
          </div>
        </Link>

        <div className="grid">
          <ScrollArea className="flex max-h-[calc(100vh-320px)]">
            <div className="space-y-2">
              {sections.map(({ category, articles }) => (
                <Section
                  key={category?.key ?? "other"}
                  category={category}
                  articles={articles}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </Toolbar>
  );
};
