import { useState } from "react";
import {
  BookMarkedIcon,
  CheckIcon,
  ChevronDownIcon,
  PlayIcon,
  PlusIcon,
  XIcon,
} from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
} from "@/design-system/primitives";
import { round } from "@/lib/number";
import { useCreateSave } from "../hooks/use-create-save";
import { SavesDetail } from "./saves-detail";
import { ProgressBadge } from "./progress-badge";
import { Save } from "./types";

const MAX_DISPLAYED_SAVES = 3;

type SavesDropdownProps = {
  saves: Save[];
  selectedSave: Save;
  storyKey: string;
  totalScenes: number;
  onSelectSave: (save: Save) => void;
  onPlay: (save: Save) => void;
};

export const SavesDropdown = ({
  saves,
  selectedSave,
  storyKey,
  totalScenes,
  onSelectSave,
  onPlay,
}: SavesDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newSaveName, setNewSaveName] = useState<string | null>(null);

  const isCreating = newSaveName !== null;
  const otherSaves = saves.filter((s) => s.key !== selectedSave.key);

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
        <DropdownMenu
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) setNewSaveName(null);
          }}
        >
          <DropdownMenuTrigger asChild>
            <Button size="lg" className="rounded-l-none border-l px-2">
              <ChevronDownIcon size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="center"
            side="bottom"
            className="min-w-48"
          >
            {otherSaves.slice(0, MAX_DISPLAYED_SAVES).map((save) => (
              <DropdownMenuItem
                key={save.key}
                onClick={() => onPlay(save)}
                className="flex justify-between gap-4"
              >
                <span className="truncate">
                  {save.name ?? save.lastScene?.title ?? "Unknown"}
                </span>
                {totalScenes > 0 && (
                  <ProgressBadge
                    percentage={round(
                      (new Set(save.history).size / totalScenes) * 100,
                    )}
                    className="shrink-0"
                  />
                )}
              </DropdownMenuItem>
            ))}
            {otherSaves.length > MAX_DISPLAYED_SAVES && (
              <p className="text-muted-foreground px-2 py-1 text-xs">
                {otherSaves.length - MAX_DISPLAYED_SAVES} other
                {otherSaves.length - MAX_DISPLAYED_SAVES > 1 ? "s" : ""}
              </p>
            )}
            <DropdownMenuSeparator />
            {isCreating ? (
              <div
                className="flex items-center gap-1 px-2 py-1.5"
                onKeyDown={(e) => e.stopPropagation()}
              >
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
                <button
                  className="hover:bg-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-sm"
                  onClick={handleCreate}
                >
                  <CheckIcon size={14} />
                </button>
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
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setNewSaveName("");
                }}
                className="data-[highlighted]:bg-primary font-medium"
              >
                <PlusIcon size={14} />
                New save
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onSelect={() => {
                setNewSaveName(null);
                setOpen(false);
                setDrawerOpen(true);
              }}
              className="text-muted-foreground"
            >
              <BookMarkedIcon size={14} />
              Manage saves
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
