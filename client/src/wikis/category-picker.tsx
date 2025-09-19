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
import { useState } from "react";
import { CommandList } from "cmdk";
import { capitalize } from "@/lib/string";
import { ScrollArea } from "@/design-system/primitives/scroll-area";
import { WikiDataCategory } from "@/domains/wiki/types";

export const CategoryPicker = ({
  onChange,
  value,
  categories,
}: {
  onChange: (value?: string | null) => void;
  value?: string | null;
  categories: WikiDataCategory[];
}) => {
  const [open, setOpen] = useState(false);
  const selectedCategory = categories.find((cat) => cat.key === value);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[250px] justify-between"
          >
            {value ? selectedCategory?.name : "No category"}

            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start" side="bottom">
          <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandList>
              <ScrollArea className="h-[150px]">
                <CommandEmpty>No category found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value={undefined}
                    onSelect={() => onChange(null)}
                  >
                    <Check
                      className={cn(
                        "mx-1 h-4 w-4",
                        value === undefined ? "opacity-100" : "opacity-0",
                      )}
                    />
                    No category
                  </CommandItem>
                  {categories.map((category) => (
                    <CommandItem
                      key={category.key}
                      value={category.key}
                      onSelect={(value) => onChange(value)}
                    >
                      <Check
                        className={cn(
                          "mx-1 h-4 w-4",
                          value === category.key ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {capitalize(category.name)}
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
