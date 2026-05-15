import { useBuilderContext } from "@/builder/hooks/use-builder-context";
import { useGetBuilder } from "@/builder/hooks/use-get-builder";
import { SimpleLoader } from "@/design-system/components/simple-loader";
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/design-system/primitives";
import { ScrollArea } from "@/design-system/primitives/scroll-area";
import { capitalize } from "@/lib/string";
import { cn } from "@/lib/style";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

export const SceneSelector = ({
  onChange,
  value,
}: {
  onChange: (value?: string | null) => void;
  value?: string | null;
}) => {
  const { story } = useBuilderContext();
  const { scenes, isLoading } = useGetBuilder({ storyKey: story.key });
  const [open, setOpen] = useState(false);
  const selectedScene = scenes?.find((scene) => scene.key === value);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="text-foreground hover:text-foreground justify-between text-xs font-normal"
          >
            {value ? selectedScene?.title : "No scene"}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-0 text-xs"
          align="start"
          side="bottom"
        >
          <Command>
            <CommandInput placeholder="Search scenes..." />
            <CommandList>
              <ScrollArea className="h-37.5">
                <CommandEmpty className="text-xs">No scene found.</CommandEmpty>
                <CommandGroup>
                  {scenes && !isLoading ? (
                    scenes.map((scene) => (
                      <CommandItem
                        className="flex justify-between text-xs"
                        key={scene.key}
                        value={scene.key}
                        onSelect={(value) => onChange(value)}
                      >
                        {capitalize(scene.title)}
                        <Check
                          className={cn(
                            "h-4 w-4",
                            value === scene.key ? "opacity-100" : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))
                  ) : (
                    <SimpleLoader />
                  )}
                </CommandGroup>
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};
