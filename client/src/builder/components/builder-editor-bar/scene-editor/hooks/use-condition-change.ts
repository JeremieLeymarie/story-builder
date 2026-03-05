import { useBuilderContext } from "@/builder/hooks/use-builder-context";
import {
  EditActionsForm,
  EditActionsSchema,
} from "@/builder/hooks/use-edit-actions-form";
import {
  CharacterConfiguration,
  ConditionalAction,
  isSceneVisitCondition,
} from "@/lib/storage/domain";
import { useState } from "react";
import { FieldArrayWithId } from "react-hook-form";
import { match, P } from "ts-pattern";

export const ALWAYS = "always";
export type Condition = ConditionalAction["condition"]["type"] | "always";

// TODO: test this
export const useConditionChange = ({
  form,
  actionField,
  actionIndex,
  characterConfig,
}: {
  form: EditActionsForm;
  actionField: FieldArrayWithId<EditActionsSchema, "actions", "id">;
  actionIndex: number;
  characterConfig: CharacterConfiguration | null;
}) => {
  const isCharacterConfigured =
    Object.keys(characterConfig?.attributes ?? {}).length > 0;
  const { story } = useBuilderContext();
  const [condition, setCondition] = useState<Condition>(
    actionField.type === "conditional" ? actionField.condition.type : ALWAYS,
  );

  const onConditionChange = (condition: Condition) => {
    const currentCondition = form.getValues(`actions.${actionIndex}.condition`);

    form.setValue(
      `actions.${actionIndex}.type`,
      condition === "always" ? "simple" : "conditional",
    );

    match(condition)
      .with(P.union("user-did-visit", "user-did-not-visit"), (condition) => {
        // Use first scene there is no current value for scene key
        const sceneKey = isSceneVisitCondition(currentCondition)
          ? currentCondition.sceneKey
          : story.firstSceneKey;

        form.setValue(`actions.${actionIndex}.condition`, {
          type: condition,
          sceneKey,
        });
      })
      .with("character-attribute", (condition) => {
        // This should never happen
        if (!isCharacterConfigured)
          throw new Error(
            `Cannot setup conditional on character if no character exists in story`,
          );

        form.setValue(`actions.${actionIndex}.condition`, {
          type: condition,
          attributeKey: Object.keys(characterConfig!.attributes)[0]!, // Random key in character's attributes
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

  return { condition, onConditionChange };
};
