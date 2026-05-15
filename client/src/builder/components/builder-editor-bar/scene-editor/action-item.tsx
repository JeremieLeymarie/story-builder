import { Controller, FieldArrayWithId } from "react-hook-form";
import { Button, Input } from "@/design-system/primitives";
import { SettingsIcon, Trash2Icon } from "lucide-react";
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
import {
  EditActionsForm,
  EditActionsSchema,
} from "@/builder/hooks/use-edit-actions-form";
import { CharacterConfiguration } from "@/lib/storage/domain";
import { match, P } from "ts-pattern";
import { SceneSelector } from "./scene-selector";
import { Field, FieldError } from "@/design-system/primitives/field";
import { CharacterConditionFormSection } from "./character-condition-section";
import {
  ALWAYS,
  Condition,
  useConditionChange,
} from "./hooks/use-condition-change";
import { Separator } from "@/design-system/primitives/separator";

const useConditionOptions = ({
  hasCharacterConfig,
}: {
  hasCharacterConfig: boolean;
}) => {
  const options: Record<Condition, { label: string; disabled?: boolean }> = {
    [ALWAYS]: { label: "Always" },
    "user-did-visit": { label: "If player visited" },
    "user-did-not-visit": { label: "If player did not visit" },
    "character-attribute": {
      label: "If character's attribute",
      disabled: !hasCharacterConfig,
    },
  };

  return options;
};

// TODO: test this
export const ActionItem = ({
  actionField,
  form,
  actionIndex,
  characterConfig,
  removeAction,
  openRandomEventsSettings,
  closeRandomEventsSettings,
}: {
  actionField: FieldArrayWithId<EditActionsSchema, "actions", "id">;
  form: EditActionsForm;
  actionIndex: number;
  characterConfig: CharacterConfiguration | null;
  removeAction: (index: number) => void;
  openRandomEventsSettings: () => void;
  closeRandomEventsSettings: () => void;
}) => {
  const hasCharacterConfig =
    Object.keys(characterConfig?.attributes ?? {}).length > 0;
  const [openSettings, setOpenSettings] = useState(false);

  const toggleSettings = () => {
    setOpenSettings((prev) => {
      // Clear form errors when closing settings since erroneous values will be discarded
      if (prev) form.clearErrors();
      return !prev;
    });
  };

  const { condition, onConditionChange } = useConditionChange({
    form,
    actionField,
    actionIndex,
    characterConfig,
    hasCharacterConfig,
  });
  const conditionOptions = useConditionOptions({ hasCharacterConfig });

  return (
    <div className="my-2" key={actionField.id}>
      <div className="flex items-center gap-2">
        <Controller
          control={form.control}
          name={`actions.${actionIndex}.text`}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="w-full">
              <Input {...field} placeholder="Go to the village" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button
          variant="outline"
          size="icon"
          type="button"
          onClick={() => {
            toggleSettings();
            if (openSettings) closeRandomEventsSettings();
            else openRandomEventsSettings();
          }}
        >
          <SettingsIcon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          type="button"
          onClick={() => removeAction(actionIndex)}
        >
          <Trash2Icon />
        </Button>
      </div>
      {openSettings && (
        <div className="mt-2 flex flex-wrap items-center gap-1 pl-2">
          <p className="text-sm">Show</p>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Select
              onValueChange={(value) => onConditionChange(value)}
              value={condition}
            >
              <SelectTrigger className="*:data-[slot=select-value]:text-xs">
                <SelectValue placeholder="Select a condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Show</SelectLabel>
                  {Object.entries(conditionOptions).map(
                    ([value, { label, disabled }]) => (
                      <SelectItem
                        key={value}
                        className="text-xs"
                        value={value}
                        disabled={disabled}
                      >
                        {label}
                      </SelectItem>
                    ),
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
            {match(condition)
              .with(P.union("user-did-visit", "user-did-not-visit"), () => (
                <Controller
                  control={form.control}
                  name={`actions.${actionIndex}.condition.sceneKey`}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="w-max">
                      <SceneSelector
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </Field>
                  )}
                />
              ))
              .with("character-attribute", () => {
                if (!characterConfig)
                  throw new Error(
                    `Cannot render character condition form if no character exists in story`,
                  );
                return (
                  <CharacterConditionFormSection
                    form={form}
                    actionIndex={actionIndex}
                    characterConfig={characterConfig}
                  />
                );
              })
              .with("always", () => null)
              .exhaustive()}
          </div>
          {Object.values(
            form.formState.errors.actions?.[actionIndex] ?? {},
          ).map((actionErrors) => {
            if (typeof actionErrors === "string") return null;

            return Object.entries(actionErrors).map(([fieldName, error]) =>
              error ? (
                <FormError className="text-xs" key={`${fieldName}-error`}>
                  {typeof error === "string"
                    ? error
                    : "message" in error
                      ? error.message
                      : null}
                </FormError>
              ) : null,
            );
          })}
          <Separator className="my-2" />
        </div>
      )}
    </div>
  );
};
