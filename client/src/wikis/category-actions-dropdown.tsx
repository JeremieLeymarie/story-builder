import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/design-system/primitives";
import { EllipsisVertical, PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { WikiDataCategory } from "@/domains/wiki/types";
import { ConfirmDialog } from "@/design-system/components";
import { useDeleteCategory } from "./hooks/use-delete-category";

export const CategoryActionsDropdown = ({
  category,
  wikiKey,
  canDelete,
}: {
  category: WikiDataCategory;
  wikiKey: string;
  canDelete: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { deleteCategory } = useDeleteCategory();

  const handleDelete = async () => {
    await deleteCategory(category.key);
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="invisible h-6 w-6 cursor-pointer transition-transform ease-in-out group-hover:visible hover:scale-105"
          >
            <EllipsisVertical size={18} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link
              to="/wikis/$wikiKey/new"
              params={{ wikiKey }}
              search={{ categoryKey: category.key }}
              className="flex cursor-pointer items-center gap-2"
            >
              <PlusIcon size={16} />
              <span>Create an article</span>
            </Link>
          </DropdownMenuItem>

          {canDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setIsOpen(false);
                  setDeleteDialogOpen(true);
                }}
                className="flex cursor-pointer items-center gap-2 text-destructive focus:text-destructive"
              >
                <Trash2Icon size={16} />
                <span>Delete category</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        title="Delete category?"
        description="Are you sure you want to delete this category? All articles in this category will also be deleted. This action cannot be undone."
        confirmLabel="Delete"
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onConfirm={handleDelete}
        trigger={<></>}
      />
    </>
  );
};
