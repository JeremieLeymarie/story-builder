import { EditActionsForm } from "@/builder/hooks/use-edit-actions-form";
import { NumberInput } from "@/design-system/components/number-input";
import { Field } from "@/design-system/primitives/field";
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
import { Controller } from "react-hook-form";
import { CharacterAttributeSelector } from "./character-attribute-selector";

const CHARACTER_ATTR_COMPARATOR_OPTIONS: Record<
  CharacterAttributeCondition["comparator"],
  string
> = { "greater-than": "is greater than", "lower-than": "is lower than" };

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
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name={`actions.${actionIndex}.condition.value`}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="h-8 max-w-10">
            <NumberInput
              onChange={field.onChange}
              defaultValue={field.value}
              className="text-xs!"
            />
          </Field>
        )}
      />
    </>
  );
};
