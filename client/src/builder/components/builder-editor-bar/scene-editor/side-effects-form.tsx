import { useGetCharacterConfig } from "@/builder/hooks/use-get-character-config";
import { useGetScene } from "@/builder/hooks/use-get-scene";
import { SimpleLoader } from "@/design-system/components/simple-loader";
import { Button, Form } from "@/design-system/primitives";
import { PlusIcon, ZapIcon } from "lucide-react";
import { SideEffectItem } from "./side-effect-item";
import { useSideEffectsForm } from "./hooks/use-side-effects-form";
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
import { Controller } from "react-hook-form";
import { ScrollArea, ScrollBar } from "@/design-system/primitives/scroll-area";

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
          {fields.length > 0 ? (
            <ScrollArea className="px-2">
              <FieldGroup className="max-h-100 gap-4">
                {fields.map((_, effectIndex) => (
                  <Controller
                    control={form.control}
                    name="effects"
                    render={({ field }) => (
                      <>
                        <SideEffectItem
                          key={field.value[effectIndex]!.key}
                          field={field.value[effectIndex]!}
                          form={form}
                          effectIndex={effectIndex}
                          characterConfig={characterConfig}
                          removeEffect={() => removeEffect(effectIndex)}
                        />
                        {effectIndex !== fields.length - 1 && (
                          <FieldSeparator className="shrink-0" />
                        )}
                      </>
                    )}
                  />
                ))}
              </FieldGroup>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          ) : (
            <EmptyDescription>No attribute yet</EmptyDescription>
          )}
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
          <ZapIcon />
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
