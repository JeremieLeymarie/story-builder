import { Controller, UseFormReturn } from "react-hook-form";
import { SideEffectsSchema } from "./hooks/use-side-effects-form";
import { CharacterConfiguration } from "@/lib/storage/domain";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/design-system/primitives/field";
import { Button, Input, Switch } from "@/design-system/primitives";
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
import { useState } from "react";
import { capitalize } from "@/lib/string";
import {
  EyeClosedIcon,
  EyeIcon,
  SettingsIcon,
  Trash2Icon,
  ZapIcon,
} from "lucide-react";

const SideEffectFormItem = ({
  characterConfig,
  effectIndex,
  form,
}: {
  form: UseFormReturn<SideEffectsSchema>;
  effectIndex: number;
  characterConfig: CharacterConfiguration;
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

const SideEffectPreview = ({
  field,
  characterConfig,
}: {
  field: SideEffectsSchema["effects"][number];
  characterConfig: CharacterConfiguration;
}) => {
  const attribute = characterConfig.attributes[field.effect.attributeKey]!;
  return (
    <FieldDescription className="space-y-1">
      <span className="flex items-center gap-1">
        {field.isVisible ? <EyeIcon size={16} /> : <EyeClosedIcon size={16} />}
        This is {field.isVisible ? "" : "not"} visible by the player.
      </span>
      <span>
        <ZapIcon size={16} className="mr-1 inline-flex font-normal" />
        When the player lands on this scene, their{" "}
        <span className="font-semibold">
          {capitalize(attribute.name)}
        </span> will{" "}
        {field.effect.operation === "add" ? "increase" : "decrease"} by{" "}
        {field.effect.value} point{field.effect.value === 1 ? "" : "s"}
      </span>
    </FieldDescription>
  );
};

export const SideEffectItem = ({
  field,
  characterConfig,
  effectIndex,
  form,
  removeEffect,
}: {
  form: UseFormReturn<SideEffectsSchema>;
  field: SideEffectsSchema["effects"][number];
  effectIndex: number;
  characterConfig: CharacterConfiguration;
  removeEffect: () => void;
}) => {
  const [isEditMode, setIsEditMode] = useState(form.formState.isDirty);

  return (
    <div className="gap-2">
      <div className="flex items-center justify-between">
        <FieldLabel>{field.name}</FieldLabel>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={() => setIsEditMode((prev) => !prev)}
          >
            <SettingsIcon />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            type="button"
            onClick={() => removeEffect()}
          >
            <Trash2Icon />
          </Button>
        </div>
      </div>
      {isEditMode ? (
        <SideEffectFormItem
          characterConfig={characterConfig}
          effectIndex={effectIndex}
          form={form}
        />
      ) : (
        <SideEffectPreview field={field} characterConfig={characterConfig} />
      )}
    </div>
  );
};
