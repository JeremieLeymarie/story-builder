import { Check, ChevronsUpDown } from "lucide-react";
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/design-system/primitives";
import { cn } from "@/lib/style";
import { useCallback, useState } from "react";
import { STORY_GENRES, StoryGenre } from "@/lib/storage/dexie/dexie-db";
import { CommandList } from "cmdk";
import { capitalize } from "@/lib/string";
import { StoryGenreBadge } from "@/design-system/components";
import { ScrollArea } from "@/design-system/primitives/scroll-area";

export const StoryGenreCombobox = ({
  onChange,
  values = [],
}: {
  onChange: (values: StoryGenre[]) => void;
  values: StoryGenre[];
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = useCallback(
    (value: StoryGenre) => {
      const idx = values.indexOf(value);

      // If present, remove the value
      if (idx !== -1) {
        const copiedValues = [...values];
        copiedValues.splice(idx, 1);

        onChange(copiedValues);
        return;
      }

      // Otherwise, add it
      onChange([...values, value]);
    },
    [onChange, values],
  );

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {values.map((genre) => (
          <StoryGenreBadge key={`${genre}-badge`} variant={genre} />
        ))}
      </div>
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[250px] justify-between"
          >
            {values.length
              ? `${values.length} genres selected...`
              : "Select genre..."}

            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start" side="bottom">
          <Command>
            <CommandInput placeholder="Search genre..." />
            <CommandList>
              <ScrollArea className="h-[300px]">
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  {STORY_GENRES.map((genre) => (
                    <CommandItem
                      key={`${genre}-command-item`}
                      value={genre}
                      onSelect={(value) => handleSelect(value as StoryGenre)}
                    >
                      <Check
                        className={cn(
                          "mx-2 h-4 w-4",
                          values.includes(genre) ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {capitalize(genre)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};
