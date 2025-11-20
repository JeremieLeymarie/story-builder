import { FieldArrayWithId, UseFieldArrayUpdate } from "react-hook-form";
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  FormControl,
  FormField,
  FormItem,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/design-system/primitives";
import { ChevronDown, SettingsIcon, Trash2Icon } from "lucide-react";
import { FormError } from "@/design-system/components";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/design-system/primitives/select";
import { useState } from "react";
import { Check } from "lucide-react";
import { useGetBuilder } from "@/builder/hooks/use-get-builder";
import { useBuilderContext } from "@/builder/hooks/use-builder-context";
import { ScrollArea } from "@/design-system/primitives/scroll-area";
import { capitalize } from "@/lib/string";
import { cn } from "@/lib/style";
import { SimpleLoader } from "@/design-system/components/simple-loader";
import {
  EditActionsForm,
  EditActionsSchema,
} from "@/builder/hooks/use-edit-actions-form";

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
            className="text-muted-foreground hover:text-muted-foreground h-8! w-[180px] justify-between text-xs font-normal"
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
              <ScrollArea className="h-[150px]">
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

export const ActionItem = ({
  actionField,
  form,
  index,
  removeAction,
  updateAction,
}: {
  actionField: FieldArrayWithId<EditActionsSchema, "actions", "id">;
  form: EditActionsForm;
  index: number;
  removeAction: (index: number) => void;
  updateAction: UseFieldArrayUpdate<EditActionsSchema, "actions">;
}) => {
  const [open, setOpen] = useState(false);
  console.log({ actionField, open });

  return (
    <FormItem className="my-2" key={actionField.id}>
      <div className="flex items-center gap-2">
        <Input
          placeholder="Go to the village"
          {...form.register(`actions.${index}.text` as const)}
          {...actionField}
        />
        <Button
          variant="outline"
          size="icon"
          type="button"
          onClick={() => setOpen((prev) => !prev)}
        >
          <SettingsIcon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          type="button"
          onClick={() => removeAction(index)}
        >
          <Trash2Icon />
        </Button>
      </div>
      {open && (
        <div className="flex items-center gap-2 text-sm">
          Show
          <FormField
            control={form.control}
            name={`actions.${index}.showCondition`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    onValueChange={(value) =>
                      updateAction(index, {
                        ...actionField,
                        showCondition: value,
                      })
                    }
                    value={field.value}
                  >
                    <SelectTrigger className="h-8! w-[180px] *:data-[slot=select-value]:text-xs">
                      <SelectValue placeholder="Select a condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel className="text-xs">
                          Show this action
                        </SelectLabel>
                        <SelectItem className="text-xs" value="always">
                          Always
                        </SelectItem>
                        <SelectItem
                          className="text-xs"
                          value="when-user-did-visit"
                        >
                          If player visited
                        </SelectItem>
                        <SelectItem
                          className="text-xs"
                          value="when-user-did-not-visit"
                        >
                          If player did not visit
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`actions.${index}.targetSceneKey`}
            render={({ field }) =>
              actionField.showCondition !== "always" ? (
                <FormItem>
                  <FormControl>
                    <SceneSelector
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                </FormItem>
              ) : (
                <></>
              )
            }
          />
        </div>
      )}
      {Object.entries(form.formState.errors.actions?.[index] ?? {}).map(
        ([_fieldName, error]) =>
          error ? (
            <FormError className="text-xs">{error.message}</FormError>
          ) : null,
      )}
    </FormItem>
  );
};
