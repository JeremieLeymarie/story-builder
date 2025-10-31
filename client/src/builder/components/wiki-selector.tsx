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
import { Wiki } from "@/lib/storage/domain";

export const WikiSelector = ({
  onChange,
  selectedWikiKey,
  wikis,
  disabled,
}: {
  onChange: (wikiKey?: string | null) => void;
  selectedWikiKey: string | null | undefined;
  wikis: Wiki[];
  disabled?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const selectedWiki = wikis.find((wiki) => wiki.key === selectedWikiKey);

  // TODO: handle state where wiki is selected

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
            {selectedWikiKey ? (
              selectedWiki?.name
            ) : (
              <span className="text-muted-foreground italic">No wiki</span>
            )}

            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start" side="bottom">
          <Command>
            <CommandInput placeholder="Search wikis..." disabled={disabled} />
            <CommandList>
              <ScrollArea className="h-[150px]">
                <CommandEmpty>No wiki found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value={undefined}
                    onSelect={() => onChange(null)}
                    className="pl-10"
                  >
                    <span className="text-muted-foreground italic">
                      No wiki
                    </span>
                  </CommandItem>
                  {wikis.map((wiki) => (
                    <CommandItem
                      key={wiki.key}
                      value={wiki.key}
                      onSelect={(wikiKey) => onChange(wikiKey)}
                    >
                      <Check
                        className={cn(
                          "mx-1 h-4 w-4",
                          selectedWikiKey === wiki.key
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {capitalize(wiki.name)}
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
