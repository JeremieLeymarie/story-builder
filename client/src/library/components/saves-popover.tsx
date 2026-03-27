import { useState } from "react";
import {
  BookMarkedIcon,
  CheckIcon,
  ChevronDownIcon,
  PlayIcon,
  PlusIcon,
  XIcon,
} from "lucide-react";
import { Button, Input } from "@/design-system/primitives";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/design-system/primitives/popover";
import { Separator } from "@/design-system/primitives/separator";
import { round } from "@/lib/number";
import { cn } from "@/lib/style";
import { useCreateSave } from "../hooks/use-create-save";
import { SavesDetail } from "./saves-detail";
import { Save } from "./types";

const itemClass =
  "hover:bg-accent flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm";

type SavesPopoverProps = {
  saves: Save[];
  selectedSave: Save;
  storyKey: string;
  totalScenes: number;
  onSelectSave: (save: Save) => void;
  onPlay: (save: Save) => void;
};

export const SavesPopover = ({
  saves,
  selectedSave,
  storyKey,
  totalScenes,
  onSelectSave,
  onPlay,
}: SavesPopoverProps) => {
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newSaveName, setNewSaveName] = useState<string | null>(null);

  const isCreating = newSaveName !== null;

  const { createSave } = useCreateSave({
    onSuccess: (createdSave) => {
      onSelectSave(createdSave);
      setNewSaveName(null);
      setOpen(false);
    },
  });

  const handleCreate = () => {
    createSave({ storyKey, name: newSaveName?.trim() || undefined });
  };

  return (
    <>
      <div className="flex items-center">
        <Button
          onClick={() => onPlay(selectedSave)}
          size="lg"
          className="rounded-r-none"
        >
          <PlayIcon />
          Play
        </Button>
        <Popover
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) setNewSaveName(null);
          }}
        >
          <PopoverTrigger asChild>
            <Button size="lg" className="rounded-l-none border-l px-2">
              <ChevronDownIcon size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="center" side="bottom" className="w-56 p-1">
            {saves.slice(0, 5).map((save) => (
              <button
                key={save.key}
                onClick={() => {
                  onPlay(save);
                  setOpen(false);
                }}
                className={cn(itemClass, "justify-between gap-4")}
              >
                <span className="truncate">
                  {save.name ?? save.lastScene?.title ?? "Unknown"}
                </span>
                {totalScenes > 0 && (
                  <span className="text-muted-foreground shrink-0 text-xs">
                    {round((new Set(save.history).size / totalScenes) * 100)}%
                  </span>
                )}
              </button>
            ))}
            {saves.length > 5 && (
              <p className="text-muted-foreground px-2 py-1 text-xs">
                {saves.length - 5} other{saves.length - 5 > 1 ? "s" : ""}
              </p>
            )}
            <Separator className="my-1" />
            {isCreating ? (
              <div className="flex items-center gap-1 px-2 py-1.5">
                <Input
                  autoFocus
                  placeholder="Save name"
                  value={newSaveName}
                  onChange={(e) => setNewSaveName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreate();
                    if (e.key === "Escape") setNewSaveName(null);
                  }}
                  className="h-7 text-sm"
                />
                <Button
                  variant="ghost"
                  size="xs"
                  className="h-7 w-7 shrink-0 p-0"
                  onClick={handleCreate}
                >
                  <CheckIcon size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="xs"
                  className="h-7 w-7 shrink-0 p-0"
                  onClick={() => setNewSaveName(null)}
                >
                  <XIcon size={14} />
                </Button>
              </div>
            ) : (
              <button onClick={() => setNewSaveName("")} className={itemClass}>
                <PlusIcon size={14} />
                New save
              </button>
            )}
            <button
              onClick={() => {
                setOpen(false);
                setDrawerOpen(true);
              }}
              className={itemClass}
            >
              <BookMarkedIcon size={14} />
              Manage saves
            </button>
          </PopoverContent>
        </Popover>
      </div>
      <SavesDetail
        selectedSave={selectedSave}
        saves={saves}
        onSelectSave={onSelectSave}
        totalScenes={totalScenes}
        open={drawerOpen}
        setOpen={setDrawerOpen}
      />
    </>
  );
};
