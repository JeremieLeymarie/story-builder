import { Controller, FieldArray, UseFormReturn } from "react-hook-form";
import { SideEffectsSchema } from "./hooks/use-side-effects-schema";
import { CharacterConfiguration } from "@/lib/storage/domain";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/design-system/primitives/field";
import { Input, Switch } from "@/design-system/primitives";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/design-system/primitives/select";
import { NumberInput } from "@/design-system/components/number-input";
import { CharacterAttributeSelector } from "./character-attribute-selector";

export const SideEffectItem = ({
  form,
  field,
  effectIndex,
  characterConfig,
  removeEffect,
}: {
  form: UseFormReturn<SideEffectsSchema>;
  field: FieldArray<SideEffectsSchema, "effects">;
  effectIndex: number;
  characterConfig: CharacterConfiguration;
  removeEffect: () => void;
}) => {
  return (
    <div className="space-y-4">
      <Controller
        control={form.control}
        name={`effects.${effectIndex}.name`}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Side Effect name</FieldLabel>
            <Input {...field} placeholder="Side Effect #1" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name={`effects.${effectIndex}.isVisible`}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor={`${effectIndex}-is-visible`}>
                Is this visible for the player?
              </FieldLabel>
              <FieldDescription>
                Whether or not the player will be be able to see the change in
                their attributes in the game.
              </FieldDescription>
            </FieldContent>
            <Switch
              id={`${effectIndex}-is-visible`}
              checked={field.value}
              onCheckedChange={field.onChange}
              name={field.name}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <FieldGroup className="flex flex-row items-center gap-2">
        <FieldLabel>Effect:</FieldLabel>
        <Controller
          control={form.control}
          name={`effects.${effectIndex}.effect.operation`}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="w-max">
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="*:data-[slot=select-value]:text-xs">
                  <SelectValue placeholder="Add/Retrieve" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem className="text-xs" value="add">
                      Add
                    </SelectItem>
                    <SelectItem className="text-xs" value="retrieve">
                      Retrieve
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name={`effects.${effectIndex}.effect.value`}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="h-8 max-w-12">
              <NumberInput
                onChange={field.onChange}
                defaultValue={field.value}
                className="text-xs!"
              />
            </Field>
          )}
        />
        <span className="text-sm">points to</span>
        <Controller
          control={form.control}
          name={`effects.${effectIndex}.effect.attributeKey`}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="w-max">
              <Field data-invalid={fieldState.invalid} className="w-max">
                <CharacterAttributeSelector
                  characterConfig={characterConfig}
                  onChange={field.onChange}
                  value={field.value}
                />
              </Field>
            </Field>
          )}
        />
      </FieldGroup>
    </div>
  );
};
