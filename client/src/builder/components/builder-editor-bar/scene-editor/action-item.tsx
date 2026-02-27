import { FieldArrayWithId } from "react-hook-form";
import {
  Button,
  FormControl,
  FormField,
  FormItem,
  Input,
} from "@/design-system/primitives";
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
import { useBuilderContext } from "@/builder/hooks/use-builder-context";
import {
  EditActionsForm,
  EditActionsSchema,
} from "@/builder/hooks/use-edit-actions-form";
import { ConditionalAction, isSceneVisitCondition } from "@/lib/storage/domain";
import { match, P } from "ts-pattern";
import { SceneSelector } from "./scene-selector";

// const useCondition = () => {
//   const onConditionChange = (condition: Condition) => {
//     setCondition(condition);
//     match(condition)
//       .with(P.union("user-did-visit", "user-did-not-visit"), () => {})
//       .with("always", () => {})
//       .exhaustive();
//   };
// };

const ALWAYS = "always";
type Condition = ConditionalAction["condition"]["type"] | "always";

const CONDITION_OPTIONS: {
  value: Condition;
  label: string;
}[] = [
  { value: ALWAYS, label: "Always" },
  { value: "user-did-visit", label: "If player visited" },
  { value: "user-did-not-visit", label: "If player did not visit" },
  { value: "character-attribute", label: "If character's attribute..." }, // TODO: only show when character is set up with at least one attribute
] as const;

export const ActionItem = ({
  actionField,
  form,
  index,
  removeAction,
  openRandomEventsSettings,
  closeRandomEventsSettings,
}: {
  actionField: FieldArrayWithId<EditActionsSchema, "actions", "id">;
  form: EditActionsForm;
  index: number;
  removeAction: (index: number) => void;
  openRandomEventsSettings: () => void;
  closeRandomEventsSettings: () => void;
}) => {
  const [openSettings, setOpenSettings] = useState(false);
  const { story } = useBuilderContext();
  const [condition, setCondition] = useState<Condition>(
    actionField.type === "conditional" ? actionField.condition.type : ALWAYS,
  );

  const onConditionChange = (condition: Condition) => {
    const currentCondition = form.getValues(`actions.${index}.condition`);

    form.setValue(
      `actions.${index}.type`,
      condition === "always" ? "simple" : "conditional",
    );

    match(condition)
      .with(P.union("user-did-visit", "user-did-not-visit"), (condition) => {
        // Use first scene there is no current value for scene key
        const sceneKey = isSceneVisitCondition(currentCondition)
          ? currentCondition.sceneKey
          : story.firstSceneKey;

        form.setValue(`actions.${index}.condition`, {
          type: condition,
          sceneKey,
        });
      })
      .with("character-attribute", (condition) => {
        form.setValue(`actions.${index}.condition`, {
          type: condition,
          attributeKey: "", // TODO:
          comparator: "greater-than",
          value: 0,
        });
      })
      .with("always", () => {
        // TODO: do we need to do something to remove potential extra fields?
      })
      .exhaustive();

    // This is a workaround around the fact that:
    // 1. form.watch doesn't work with react compiler for now
    // 2. using form.setValue in a nested field of a field array doesn't trigger a rerender for the parent field
    setCondition(condition);
  };

  return (
    <FormItem className="my-2" key={actionField.id}>
      <div className="flex items-center gap-2">
        <Input
          placeholder="Go to the village"
          {...form.register(`actions.${index}.text` as const)}
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
          onClick={() => removeAction(index)}
        >
          <Trash2Icon />
        </Button>
      </div>
      {openSettings && (
        <div className="flex items-center gap-2 text-sm">
          Show
          <FormField
            control={form.control}
            name={`actions.${index}.condition.type`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    onValueChange={(value) => onConditionChange(value)}
                    value={field.value ?? "always"}
                  >
                    <SelectTrigger className="h-8! w-45 *:data-[slot=select-value]:text-xs">
                      <SelectValue placeholder="Select a condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup defaultValue="always">
                        <SelectLabel>Show</SelectLabel>
                        {CONDITION_OPTIONS.map(({ label, value }) => (
                          <SelectItem className="text-xs" value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          {match(condition)
            .with(P.union("user-did-visit", "user-did-not-visit"), () => (
              <FormField
                control={form.control}
                name={`actions.${index}.condition.sceneKey`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SceneSelector
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))
            .with("character-attribute", () => (
              <FormField
                control={form.control}
                name={`actions.${index}.condition.attributeKey`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>COUCOU</FormControl>
                  </FormItem>
                )}
              />
            ))
            .with("always", () => null)
            .exhaustive()}
        </div>
      )}
      {Object.entries(form.formState.errors.actions?.[index] ?? {}).map(
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
    </FormItem>
  );
};
