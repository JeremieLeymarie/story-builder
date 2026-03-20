import { Button, Form, FormDescription } from "@/design-system/primitives";
import { PlusIcon } from "lucide-react";
import { useEditActionsForm } from "@/builder/hooks/use-edit-actions-form";
import { useBuilderActions } from "@/builder/hooks/use-builder-actions";
import { useGetScene } from "@/builder/hooks/use-get-scene";
import { SimpleLoader } from "@/design-system/components/simple-loader";
import { CharacterConfiguration, Scene } from "@/lib/storage/domain";
import { useGetCharacterConfig } from "@/builder/hooks/use-get-character-config";
import { ActionItem } from "./action-item";

const ActionsFormContent = ({
  scene,
  characterConfig,
}: {
  scene: Scene;
  characterConfig: CharacterConfiguration | null;
}) => {
  const { updateScene, makeEmptyActionPayload } = useBuilderActions();
  const { append, fields, form, remove } = useEditActionsForm({
    actions: scene.actions,
    onSave: (payload) => updateScene({ key: scene.key, ...payload }),
  });

  const removeAction = (index?: number | number[]) => {
    remove(index);
  };

  return (
    <Form {...form}>
      <form onSubmit={(ev) => ev.preventDefault()}>
        <div className="w-full space-y-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <p className="text-md font-bold">Actions</p>
              <Button
                variant="ghost"
                type="button"
                size="icon"
                onClick={() => append(makeEmptyActionPayload())}
              >
                <PlusIcon />
              </Button>
            </div>
            <hr />
          </div>

          <FormDescription className="my-2">
            Buttons that allow the player to move in your story
          </FormDescription>
          <div>
            {fields.map((field, actionIndex) => (
              <ActionItem
                key={field.id}
                actionField={field}
                form={form}
                actionIndex={actionIndex}
                characterConfig={characterConfig}
                removeAction={removeAction}
              />
            ))}
          </div>
        </div>
      </form>
    </Form>
  );
};

export const ActionsFormContainer = ({ sceneKey }: { sceneKey: string }) => {
  const { scene, isLoading } = useGetScene(sceneKey);
  const { characterConfig, isLoading: isCharacterLoading } =
    useGetCharacterConfig();

  if (
    isLoading ||
    scene === undefined ||
    isCharacterLoading ||
    characterConfig === undefined
  )
    return <SimpleLoader />;

  return <ActionsFormContent scene={scene} characterConfig={characterConfig} />;
};
