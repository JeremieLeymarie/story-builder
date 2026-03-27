import { ResponsiveDrawer } from "@/design-system/components/responsive-drawer";
import {
  Button,
  Card,
  CardDescription,
  CardTitle,
  Input,
} from "@/design-system/primitives";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { PencilIcon, PlusIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/style";
import { Save } from "./types";
import { formatDate, timeFrom } from "@/lib/date";
import { useCreateSave } from "../hooks/use-create-save";
import { ScrollArea, ScrollBar } from "@/design-system/primitives/scroll-area";
import { useState } from "react";
import { ConfirmDialog } from "@/design-system/components";
import { useDeleteProgress } from "../hooks/use-delete-progress";
import { useRenameSave } from "../hooks/use-rename-save";
import { round } from "@/lib/number";
import { ProgressBadge } from "./progress-badge";

type SavesDetailProps = {
  selectedSave: Save;
  saves: Save[];
  onSelectSave: (save: Save) => void;
  setOpen: (open: boolean) => void;
  totalScenes: number;
};

const Content = ({
  selectedSave,
  saves,
  onSelectSave,
  setOpen,
  totalScenes,
}: SavesDetailProps) => {
  const storyKey = selectedSave.storyKey; // All saves should have the same story key
  const [newSaveName, setNewSaveName] = useState("");
  const [isNaming, setIsNaming] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const { createSave, isPending: isCreatingSave } = useCreateSave({
    onSuccess: (createdSave) => {
      onSelectSave(createdSave);
      setOpen(false);
    },
  });
  const { renameSave } = useRenameSave();
  const isMobile = useIsMobile();
  const { deleteProgress, isDeleting } = useDeleteProgress(storyKey);

  const handleCreateSave = () => {
    createSave({ storyKey, name: newSaveName || undefined });
    setNewSaveName("");
    setIsNaming(false);
  };

  const handleRename = (save: Save) => {
    const trimmedName = editingName.trim();
    if (trimmedName) {
      renameSave({ progress: save, name: trimmedName });
    }
    setEditingKey(null);
    setEditingName("");
  };

  return (
    <>
      <div className="mb-2 flex w-full items-center justify-end gap-2 pr-4">
        {isNaming ? (
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateSave();
            }}
          >
            <Input
              autoFocus
              placeholder="Save name"
              value={newSaveName}
              onChange={(e) => setNewSaveName(e.target.value)}
              className="h-9 w-40"
            />
            <Button type="submit" disabled={isCreatingSave}>
              Create
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsNaming(false);
                setNewSaveName("");
              }}
            >
              Cancel
            </Button>
          </form>
        ) : (
          <Button
            title="New save"
            disabled={isCreatingSave}
            onClick={() => setIsNaming(true)}
          >
            New save
            <PlusIcon size={24} />
          </Button>
        )}
      </div>

      <ScrollArea>
        <div
          className={cn(
            "mb-4 space-y-4 px-4 pt-4",
            isMobile ? "max-h-80" : "max-h-[calc(100dvh-200px)]",
          )}
        >
          {saves.map((save) => (
            <Card
              key={save.key}
              className={cn(
                "ring-primary relative p-3 ring-2 transition-all hover:shadow-lg",
                save.key === selectedSave.key && "bg-primary/15",
                save.finished && "bg-accent/75 ring-accent-foreground/10",
              )}
              onClick={() => {
                if (editingKey !== save.key) {
                  onSelectSave(save);
                  setOpen(false);
                }
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 cursor-pointer">
                  <div className="flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                      {editingKey === save.key ? (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleRename(save);
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Input
                            autoFocus
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onBlur={() => handleRename(save)}
                            className="h-7 w-40 text-sm"
                          />
                        </form>
                      ) : (
                        <CardTitle className="text-base break-all">
                          <Button
                            variant="ghost"
                            size="xs"
                            className="mr-1 inline-flex h-5 w-5 p-0 align-text-bottom"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingKey(save.key);
                              setEditingName(save.name ?? "");
                            }}
                          >
                            <PencilIcon size={12} />
                          </Button>
                          {save.name || save.lastScene?.title || "Unknown scene"}
                        </CardTitle>
                      )}
                    </div>
                    {totalScenes > 0 && (
                      <ProgressBadge
                        percentage={round((new Set(save.history).size / totalScenes) * 100)}
                        className="shrink-0"
                      />
                    )}
                  </div>
                  {save.name && (
                    <p className="text-muted-foreground text-xs">
                      {save.lastScene?.title || "Unknown scene"}
                    </p>
                  )}
                  <CardDescription>
                    {timeFrom(save.lastPlayedAt)} ·{" "}
                    {formatDate(save.lastPlayedAt)}
                  </CardDescription>
                </div>

                {save.key !== selectedSave.key && (
                  <ConfirmDialog
                    title="Delete this save?"
                    description="This action cannot be undone. This save will be permanently deleted."
                    confirmLabel="Delete"
                    onConfirm={(e) => {
                      e.stopPropagation();
                      deleteProgress(save.key);
                    }}
                    onCancel={(e) => {
                      e.stopPropagation();
                    }}
                    trigger={
                      <Button
                        disabled={isDeleting}
                        variant="destructive"
                        size="xs"
                        className="rounded-full"
                        title="Delete this save"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <XIcon />
                      </Button>
                    }
                  />
                )}
                {save.finished && (
                  <span className="absolute -top-2 left-2.5 z-1 rounded-full bg-green-500/75 px-1.5 py-0.5 text-xs text-white">
                    COMPLETED
                  </span>
                )}
              </div>
            </Card>
          ))}
          {/* Only way I could find to add padding at the bottom of a scroll area */}
          <div className="h-4"></div>
        </div>
        <ScrollBar />
      </ScrollArea>
    </>
  );
};

export const SavesDetail = ({
  selectedSave,
  saves,
  onSelectSave,
  totalScenes,
  open,
  setOpen,
}: Omit<SavesDetailProps, "setOpen"> & {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  return (
    <ResponsiveDrawer
      open={open}
      setOpen={setOpen}
      trigger={<span />}
      content={
        <Content
          setOpen={setOpen}
          selectedSave={selectedSave}
          saves={saves}
          onSelectSave={onSelectSave}
          totalScenes={totalScenes}
        />
      }
      title="Your saves"
      description="Click on a save to select it"
    />
  );
};
