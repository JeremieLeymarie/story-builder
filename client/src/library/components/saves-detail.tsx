import { ResponsiveDrawer } from "@/design-system/components/responsive-drawer";
import {
  Button,
  Card,
  CardDescription,
  CardTitle,
  ProgressBadge,
} from "@/design-system/primitives";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { PencilIcon, PlusIcon, XIcon } from "lucide-react";
import { SaveNameForm } from "./save-name-form";
import { cn } from "@/lib/style";
import { Save } from "./types";
import { formatDate, timeFrom } from "@/lib/date";
import { useCreateSave } from "../hooks/use-create-save";
import { ScrollArea, ScrollBar } from "@/design-system/primitives/scroll-area";
import { useState } from "react";
import { ConfirmDialog } from "@/design-system/components";
import { useDeleteProgress } from "../hooks/use-delete-progress";
import { useRenameSave } from "../hooks/use-rename-save";

type SavesDetailProps = {
  selectedSave: Save;
  saves: Save[];
  onSelectSave: (save: Save) => void;
  setOpen: (open: boolean) => void;
  getProgressRate?: (history: string[]) => number;
};

const Content = ({
  selectedSave,
  saves,
  onSelectSave,
  setOpen,
  getProgressRate,
}: SavesDetailProps) => {
  const storyKey = selectedSave.storyKey; // All saves should have the same story key
  const [isNaming, setIsNaming] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const { createSave, isPending: isCreatingSave } = useCreateSave({
    onSuccess: (createdSave) => {
      onSelectSave(createdSave);
      setOpen(false);
    },
  });
  const { renameSave } = useRenameSave();
  const isMobile = useIsMobile();
  const { deleteProgress, isDeleting } = useDeleteProgress(storyKey);

  const handleRename = (save: Save, name?: string) => {
    if (name) {
      renameSave({ progress: save, name });
    }
    setEditingKey(null);
  };

  return (
    <>
      <div className="mb-2 flex w-full items-center justify-end gap-2 pr-4">
        {isNaming ? (
          <SaveNameForm
            defaultName={`Save #${saves.length + 1}`}
            onSubmit={(name) => createSave({ storyKey, name })}
            onCancel={() => setIsNaming(false)}
            disabled={isCreatingSave}
          />
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
              <div className="flex items-center gap-2">
                {getProgressRate && (
                  <ProgressBadge
                    percentage={getProgressRate(save.history)}
                    className="mt-0.5 shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1 cursor-pointer overflow-hidden">
                  {editingKey === save.key ? (
                    <SaveNameForm
                      variant="inline"
                      defaultName={save.name ?? ""}
                      onSubmit={(name) => handleRename(save, name)}
                      onCancel={() => setEditingKey(null)}
                    />
                  ) : (
                    <CardTitle className="text-base break-all">
                      <span className="font-medium">
                        {save.name ?? save.lastScene?.title ?? "Unknown scene"}
                      </span>
                    </CardTitle>
                  )}
                  {save.name && save.lastScene && (
                    <p className="text-muted-foreground text-sm">
                      {save.lastScene.title}
                    </p>
                  )}
                  <CardDescription>
                    {timeFrom(save.lastPlayedAt)} ·{" "}
                    {formatDate(save.lastPlayedAt)}
                  </CardDescription>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="xs"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingKey(save.key);
                    }}
                  >
                    <PencilIcon size={12} />
                  </Button>
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
                </div>
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
  getProgressRate,
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
      content={
        <Content
          setOpen={setOpen}
          selectedSave={selectedSave}
          saves={saves}
          onSelectSave={onSelectSave}
          getProgressRate={getProgressRate}
        />
      }
      title="Your saves"
      description="Click on a save to select it"
    />
  );
};
