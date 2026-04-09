import { useState } from "react";
import {
  BookMarkedIcon,
  ChevronDownIcon,
  PlayIcon,
  PlusIcon,
} from "lucide-react";
import {
  Button,
  ButtonGroup,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/design-system/primitives";
import { useCreateSave } from "../hooks/use-create-save";
import { SavesDetail } from "./saves-detail";
import { SaveNameForm } from "./save-name-form";
import { ProgressBadge } from "@/design-system/components/progress-badge";
import { Save } from "./types";

const MAX_DISPLAYED_SAVES = 3;

type SavesDropdownProps = {
  saves: Save[];
  selectedSave: Save;
  storyKey: string;
  getProgressRate?: (history: string[]) => number;
  onSelectSave: (save: Save) => void;
  onPlay: (save: Save) => void;
};

export const SavesDropdown = ({
  saves,
  selectedSave,
  storyKey,
  getProgressRate,
  onSelectSave,
  onPlay,
}: SavesDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const otherSaves = saves
    .filter((s) => s.key !== selectedSave.key)
    .sort((a, b) => b.lastPlayedAt.getTime() - a.lastPlayedAt.getTime());

  const { createSave } = useCreateSave({
    onSuccess: (createdSave) => {
      onSelectSave(createdSave);
      setIsCreating(false);
      setOpen(false);
    },
  });

  return (
    <>
      <ButtonGroup>
        <Button onClick={() => onPlay(selectedSave)} size="lg">
          <PlayIcon />
          Play
        </Button>
        <DropdownMenu
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) setIsCreating(false);
          }}
        >
          <DropdownMenuTrigger asChild>
            <Button size="lg" className="px-2">
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
                onClick={() => onSelectSave(save)}
                className="flex justify-between gap-4"
              >
                <span className="truncate font-medium">
                  {save.name ?? save.lastScene?.title ?? "Unknown"}
                </span>
                {getProgressRate && (
                  <ProgressBadge
                    percentage={getProgressRate(save.history)}
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
              <SaveNameForm
                variant="compact"
                defaultName={`Save #${saves.length + 1}`}
                onSubmit={(name) => createSave({ storyKey, name })}
                onCancel={() => setIsCreating(false)}
              />
            ) : (
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setIsCreating(true);
                }}
                className="data-[highlighted]:bg-primary font-medium"
              >
                <PlusIcon size={14} />
                New save
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onSelect={() => {
                setIsCreating(false);
                setOpen(false);
                setDrawerOpen(true);
              }}
              className="data-[highlighted]:bg-primary font-medium"
            >
              <BookMarkedIcon size={14} />
              Manage saves
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
      <SavesDetail
        selectedSave={selectedSave}
        saves={saves}
        onSelectSave={onSelectSave}
        getProgressRate={getProgressRate}
        open={drawerOpen}
        setOpen={setDrawerOpen}
      />
    </>
  );
};
