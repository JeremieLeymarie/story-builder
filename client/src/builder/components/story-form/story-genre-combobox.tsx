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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          Select genre...
          {/* {values
            ? frameworks.find((framework) => framework.value === values)?.label
            : "Select framework..."} */}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search genre..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {STORY_GENRES.map((genre) => (
                <CommandItem
                  key={genre}
                  value={genre}
                  onSelect={(value) => handleSelect(value as StoryGenre)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      values.includes(genre) ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {capitalize(genre)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
