import { EditActionsForm } from "@/builder/hooks/use-edit-actions-form";
import { NumberInput } from "@/design-system/components/number-input";
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
import { Field, FieldError } from "@/design-system/primitives/field";
import { ScrollArea } from "@/design-system/primitives/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/design-system/primitives/select";
import {
  CharacterAttributeCondition,
  CharacterConfiguration,
} from "@/lib/storage/domain";
import { capitalize } from "@/lib/string";
import { cn } from "@/lib/style";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Controller } from "react-hook-form";

const CharacterAttributeSelector = ({
  onChange,
  value,
  characterConfig,
}: {
  onChange: (attributeKey?: string | null) => void;
  value?: string | null;
  characterConfig: CharacterConfiguration;
}) => {
  const [open, setOpen] = useState(false);
  const selectedAttr = value
    ? (characterConfig.attributes[value] ?? null)
    : null;

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
            {value ? selectedAttr?.name : "No attribute"}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-0 text-xs"
          align="start"
          side="bottom"
        >
          <Command>
            <CommandInput placeholder="Search attributes..." />
            <CommandList>
              <ScrollArea className="h-37.5">
                <CommandEmpty className="text-xs">
                  No attribute found.
                </CommandEmpty>
                <CommandGroup>
                  {Object.values(characterConfig.attributes).map(
                    (attribute) => (
                      <CommandItem
                        className="flex justify-between text-xs"
                        key={attribute.key}
                        value={attribute.key}
                        onSelect={(value) => onChange(value)}
                      >
                        {capitalize(attribute.name)}
                        <Check
                          className={cn(
                            "h-4 w-4",
                            value === attribute.key
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ),
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

const CHARACTER_ATTR_COMPARATOR_OPTIONS: Record<
  CharacterAttributeCondition["comparator"],
  string
> = { "greater-than": "is greater than", "lower-than": "is lower than" };

// TODO: handle errors in prettier way
export const CharacterConditionFormSection = ({
  form,
  actionIndex,
  characterConfig,
}: {
  form: EditActionsForm;
  actionIndex: number;
  characterConfig: CharacterConfiguration;
}) => {
  return (
    <>
      <Controller
        control={form.control}
        name={`actions.${actionIndex}.condition.attributeKey`}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="w-max">
            <CharacterAttributeSelector
              characterConfig={characterConfig}
              onChange={field.onChange}
              value={field.value}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name={`actions.${actionIndex}.condition.comparator`}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="w-max">
            <Select
              onValueChange={field.onChange}
              value={field.value ?? "always"}
            >
              <SelectTrigger className="*:data-[slot=select-value]:text-xs">
                <SelectValue placeholder="Select a condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup defaultValue="">
                  {Object.entries(CHARACTER_ATTR_COMPARATOR_OPTIONS).map(
                    ([value, label]) => (
                      <SelectItem className="text-xs" value={value}>
                        {label}
                      </SelectItem>
                    ),
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name={`actions.${actionIndex}.condition.value`}
        render={({ field, fieldState }) => (
          <Field
            data-invalid={fieldState.invalid}
            className="h-8 max-w-12 text-xs!"
          >
            <NumberInput onChange={field.onChange} defaultValue={field.value} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </>
  );
};
