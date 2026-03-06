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

const CONDITION_OPTIONS: Record<Condition, string> = {
  [ALWAYS]: "Always",
  "user-did-visit": "If player visited",
  "user-did-not-visit": "If player did not visit",
  "character-attribute": "If character's attribute...", // TODO: only show when character is set up with at least one attribute
};

// TODO: test this
// TODO: selectors have horrendous performance on open, we should dig into it
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
  const [openSettings, setOpenSettings] = useState(false);
  const { condition, onConditionChange } = useConditionChange({
    form,
    actionField,
    actionIndex,
    characterConfig,
  });

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
            setOpenSettings((prev) => !prev);
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
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
          Show
          <Controller
            control={form.control}
            name={`actions.${actionIndex}.condition.type`}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="w-max">
                <Select
                  onValueChange={(value) => onConditionChange(value)}
                  value={field.value ?? "always"}
                >
                  <SelectTrigger className="*:data-[slot=select-value]:text-xs">
                    <SelectValue placeholder="Select a condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup defaultValue="always">
                      <SelectLabel>Show</SelectLabel>
                      {Object.entries(CONDITION_OPTIONS).map(
                        ([value, label]) => (
                          <SelectItem className="text-xs" value={value}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
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
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
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
      )}
      {Object.entries(form.formState.errors.actions?.[actionIndex] ?? {}).map(
        ([_fieldName, error]) =>
          error ? (
            <FormError className="text-xs">
              {typeof error === "string"
                ? error
                : "message" in error
                  ? error.message
                  : null}
            </FormError>
          ) : null,
      )}
    </div>
  );
};
