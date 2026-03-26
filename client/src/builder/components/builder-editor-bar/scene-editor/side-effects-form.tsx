import { useGetCharacterConfig } from "@/builder/hooks/use-get-character-config";
import { useGetScene } from "@/builder/hooks/use-get-scene";
import { SimpleLoader } from "@/design-system/components/simple-loader";
import { Button, Form } from "@/design-system/primitives";
import { PlusIcon, SparklesIcon } from "lucide-react";
import { SideEffectItem } from "./side-effect-item";
import { useSideEffectsForm } from "./hooks/use-side-effects-schema";
import { CharacterConfiguration } from "@/lib/storage/domain";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/design-system/primitives/empty";
import { useBuilderEditorStore } from "@/builder/hooks/use-builder-editor-store";
import { FieldGroup, FieldSeparator } from "@/design-system/primitives/field";

const SideEffectForm = ({
  characterConfig,
}: {
  characterConfig: CharacterConfiguration;
}) => {
  const { form, fields, addEffect, removeEffect } = useSideEffectsForm({
    characterConfig,
  });

  return (
    <Form {...form}>
      <form>
        <div className="w-full space-y-2">
          <div>
            <p className="text-sm">
              Side effects are special actions that are triggered on a specific
              event.
            </p>
            <p className="text-muted-foreground text-sm italic">
              For example, you can use them to create a level-up mechanism, by
              increasing a character attribute when the player arrives on a
              page.
            </p>
          </div>
          <div className="mb-2 flex items-center gap-2">
            <p className="text-md font-bold">Update character's attribute</p>
            <Button
              variant="ghost"
              type="button"
              size="icon"
              onClick={addEffect}
            >
              <PlusIcon />
            </Button>
          </div>
          <FieldGroup>
            {fields.map((field, effectIndex) => (
              <>
                <SideEffectItem
                  key={field.id}
                  field={field}
                  form={form}
                  effectIndex={effectIndex}
                  characterConfig={characterConfig}
                  removeEffect={removeEffect}
                />
                {effectIndex !== fields.length - 1 && <FieldSeparator />}
              </>
            ))}
          </FieldGroup>
        </div>
      </form>
    </Form>
  );
};

export const SideEffectsFormContainer = ({
  sceneKey,
}: {
  sceneKey: string;
}) => {
  const { scene, isLoading } = useGetScene(sceneKey);
  const { characterConfig, isLoading: isCharacterLoading } =
    useGetCharacterConfig();
  const openCharacterEditor = useBuilderEditorStore(
    (state) => () => state.open({ type: "character-editor", payload: null }),
  );

  if (
    isLoading ||
    scene === undefined ||
    isCharacterLoading ||
    characterConfig === undefined
  )
    return <SimpleLoader />;

  const hasCharacter =
    Object.keys(characterConfig?.attributes ?? {}).length > 0;

  if (!hasCharacter)
    return (
      <Empty>
        <EmptyMedia variant="icon">
          <SparklesIcon />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>No Character configured</EmptyTitle>
          {/* TODO: add docs link */}
          <EmptyDescription>
            Side Effects are currently limited to character attributes. You need
            to have a character configured to start adding side effects.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={openCharacterEditor} size="sm">
            Go to character creation
          </Button>
        </EmptyContent>
      </Empty>
    );

  return <SideEffectForm characterConfig={characterConfig!} />;
};
