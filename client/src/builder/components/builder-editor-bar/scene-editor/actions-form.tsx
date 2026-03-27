import { Button, Form, FormDescription } from "@/design-system/primitives";
import { PlusIcon } from "lucide-react";
import { useEditActionsForm } from "@/builder/hooks/use-edit-actions-form";
import { useBuilderActions } from "@/builder/hooks/use-builder-actions";
import { useGetScene } from "@/builder/hooks/use-get-scene";
import { SimpleLoader } from "@/design-system/components/simple-loader";
import { CharacterConfiguration, Scene } from "@/lib/storage/domain";
import { DragEvent, useRef } from "react";
import { useGetCharacterConfig } from "@/builder/hooks/use-get-character-config";
import { ActionItem, DragHandlers } from "./action-item";

const useActionDrag = (move: (from: number, to: number) => void) => {
  const dragIndexRef = useRef<number | null>(null);

  const getDragHandlers = (index: number): DragHandlers => ({
    onDragStart(e: DragEvent<HTMLDivElement>) {
      dragIndexRef.current = index;
      e.dataTransfer.effectAllowed = "move";
    },
    onDragOver(e: DragEvent<HTMLDivElement>) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      const dragIndex = dragIndexRef.current;
      if (dragIndex !== null && dragIndex !== index) {
        e.currentTarget.dataset.dragOver =
          dragIndex < index ? "below" : "above";
      }
    },
    onDragLeave(e: DragEvent<HTMLDivElement>) {
      delete e.currentTarget.dataset.dragOver;
    },
    onDrop(e: DragEvent<HTMLDivElement>) {
      e.preventDefault();
      const fromIndex = dragIndexRef.current;
      if (fromIndex !== null && fromIndex !== index) {
        move(fromIndex, index);
      }
      delete e.currentTarget.dataset.dragOver;
      dragIndexRef.current = null;
    },
    onDragEnd() {
      dragIndexRef.current = null;
    },
  });

  return { getDragHandlers };
};

const ActionsFormContent = ({
  scene,
  characterConfig,
}: {
  scene: Scene;
  characterConfig: CharacterConfiguration | null;
}) => {
  const { updateScene, makeEmptyActionPayload } = useBuilderActions();
  const { append, fields, form, remove, move } = useEditActionsForm({
    actions: scene.actions,
    onSave: (payload) => updateScene({ key: scene.key, ...payload }),
  });

  const removeAction = (index?: number | number[]) => {
    remove(index);
  };

  const { getDragHandlers } = useActionDrag(move);

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
                dragHandlers={getDragHandlers(actionIndex)}
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
