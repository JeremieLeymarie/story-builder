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
import z from "zod";

export const ALWAYS = "always";
export type Condition = ConditionalAction["condition"]["type"] | "always";

const conditionSchema = z.union([
  z.literal("always"),
  z.literal("user-did-visit"),
  z.literal("user-did-not-visit"),
  z.literal("character-attribute"),
]);

function assertIsCondition(value: string): asserts value is Condition {
  conditionSchema.parse(value);
}

// TODO: test this
export const useConditionChange = ({
  form,
  actionField,
  actionIndex,
  characterConfig,
  hasCharacterConfig,
}: {
  form: EditActionsForm;
  actionField: FieldArrayWithId<EditActionsSchema, "actions", "id">;
  actionIndex: number;
  characterConfig: CharacterConfiguration | null;
  hasCharacterConfig: boolean;
}) => {
  const { story } = useBuilderContext();
  const [condition, setCondition] = useState<Condition>(
    actionField.type === "conditional" ? actionField.condition.type : ALWAYS,
  );

  const onConditionChange = (condition: string) => {
    assertIsCondition(condition);
    const currentAction = form.getValues(`actions.${actionIndex}`);
    const commonFields = {
      key: currentAction.key,
      targets: currentAction.targets,
      text: currentAction.text,
    };

    match(condition)
      .with(P.union("user-did-visit", "user-did-not-visit"), (condition) => {
        const isConditionAction = currentAction.type === "conditional";
        // Use first scene if there is no current value for scene key
        const sceneKey =
          isConditionAction && isSceneVisitCondition(currentAction.condition)
            ? currentAction.condition.sceneKey
            : story.firstSceneKey;

        form.setValue(`actions.${actionIndex}`, {
          ...commonFields,
          type: "conditional",
          condition: { type: condition, sceneKey },
        });
      })
      .with("character-attribute", (condition) => {
        // This should never happen
        if (!hasCharacterConfig)
          throw new Error(
            `Cannot setup conditional on character if no character exists in story`,
          );

        form.setValue(`actions.${actionIndex}`, {
          ...commonFields,
          type: "conditional",
          condition: {
            type: condition,
            attributeKey: Object.keys(characterConfig!.attributes)[0]!, // Random key in character's attributes
            comparator: "greater-than",
            value: 0,
          },
        });
      })
      .with("always", () => {
        form.setValue(`actions.${actionIndex}`, {
          ...commonFields,
          type: "simple",
        });
      })
      .exhaustive();

    // This is a workaround around the fact that:
    // 1. form.watch doesn't work with react compiler for now
    // 2. using form.setValue in a nested field of a field array doesn't trigger a rerender for the parent field
    setCondition(condition);
  };

  return { condition, onConditionChange };
};
