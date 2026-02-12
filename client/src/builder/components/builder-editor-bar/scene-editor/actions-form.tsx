import { Button, Form, FormDescription } from "@/design-system/primitives";
import { PlusIcon } from "lucide-react";
import { ActionItem } from "./action-item";
import { useEditActionsForm } from "@/builder/hooks/use-edit-actions-form";
import { Action } from "@/lib/storage/domain";

export const ActionsForm = ({
  actionFormProps,
  makeEmptyActionPayload,
}: {
  actionFormProps: ReturnType<typeof useEditActionsForm>;
  makeEmptyActionPayload: () => Action;
}) => {
  const { append, fields, form, remove, adaptDomainAction, adaptFormAction } =
    actionFormProps;

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
                onClick={() =>
                  append(adaptDomainAction(makeEmptyActionPayload()))
                }
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
            {fields.map((field, index) => (
              <ActionItem
                key={field.id}
                actionField={field}
                form={form}
                index={index}
                removeAction={remove}
                adaptFormAction={adaptFormAction}
              />
            ))}
          </div>
        </div>
      </form>
    </Form>
  );
};
