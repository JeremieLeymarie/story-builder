import { ResponsiveDrawer } from "@/design-system/components/responsive-drawer";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/design-system/primitives";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { BookMarkedIcon, PlusIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/style";
import { Save } from "./types";
import { formatDate, timeFrom } from "@/lib/date";
import { useCreateSave } from "./hooks/use-create-save";
import { ScrollArea, ScrollBar } from "@/design-system/primitives/scroll-area";
import { useState } from "react";
import { ConfirmDialog } from "@/design-system/components";
import { useDeleteProgress } from "./hooks/use-delete-progress";

type SavesDetailProps = {
  selectedSave: Save;
  saves: Save[];
  onSelectSave: (save: Save) => void;
  setOpen: (open: boolean) => void;
};

const Content = ({
  selectedSave,
  saves,
  onSelectSave,
  setOpen,
}: SavesDetailProps) => {
  const storyKey = selectedSave.storyKey; // All saves should have the same story key
  const { createSave, isPending: isCreatingSave } = useCreateSave({
    onSuccess: (createdSave) => {
      onSelectSave(createdSave);
      setOpen(false);
    },
  });
  const isMobile = useIsMobile();
  const { deleteProgress, isDeleting } = useDeleteProgress(storyKey);

  return (
    <>
      <div className="mb-2 flex w-full justify-end pr-4">
        <Button
          size="sm"
          title="New save"
          disabled={isCreatingSave}
          onClick={() => createSave(storyKey)}
        >
          New save
          <PlusIcon size={24} />
        </Button>
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
                onSelectSave(save);
                setOpen(false);
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex-1 cursor-pointer">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">
                        {save.lastScene?.title || "Unknown scene"}
                      </CardTitle>
                    </div>
                    <CardDescription>
                      {timeFrom(save.lastPlayedAt)}
                    </CardDescription>
                    <CardContent className="pl-0">
                      <p className="text-muted-foreground/80 text-xs">
                        {formatDate(save.lastPlayedAt)}
                      </p>
                    </CardContent>
                  </div>
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
}: Omit<SavesDetailProps, "setOpen">) => {
  const [open, setOpen] = useState(false);

  return (
    <ResponsiveDrawer
      open={open}
      setOpen={setOpen}
      trigger={
        <Button size="default" variant="outline">
          <BookMarkedIcon />
          Select another save
        </Button>
      }
      content={
        <Content
          setOpen={setOpen}
          selectedSave={selectedSave}
          saves={saves}
          onSelectSave={onSelectSave}
        />
      }
      title="Your saves"
      description="Click on a save to select it"
    />
  );
};
