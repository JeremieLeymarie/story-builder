import { Form, FormMessage, Input } from "@/design-system/primitives";
import { useBuilderActions } from "@/builder/hooks/use-builder-actions";
import { Action, Scene } from "@/lib/storage/domain";
import {
  useEditRandomEventForm,
  RandomEventSchema,
} from "@/builder/hooks/use-random-event-form";
import { useProbabilityMask } from "@/builder/hooks/use-probability-mask";
import { Controller, ControllerRenderProps } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/design-system/primitives/field";
import { FormError } from "@/design-system/components";

const ProbabilityInput = ({
  field,
  fieldState,
}: {
  field: ControllerRenderProps<RandomEventSchema, string>;
  fieldState: { invalid: boolean };
}) => {
  const inputRef = useProbabilityMask();

  return (
    <Input
      className="max-w-15 min-w-15"
      aria-invalid={fieldState.invalid}
      value={field.value}
      onInput={(e) => {
        field.onChange(e.currentTarget.value);
      }}
      ref={(node) => {
        inputRef(node);
        field.ref(node);
      }}
    />
  );
};

export const RandomEventsForm = ({
  scenesByKey,
  action,
  sourceScene,
}: {
  scenesByKey: Record<string, Scene>;
  action: Action;
  sourceScene: Scene;
}) => {
  const { updateTargetProbability } = useBuilderActions();

  const { form } = useEditRandomEventForm({
    defaultValues: Object.fromEntries(
      action.targets.map((target) => [
        target.sceneKey,
        `${target.probability}%`,
      ]),
    ),
    sourceScene,
    action,
    updateTargetProbability,
  });

  console.log(form.formState.errors);
  // const values = form.watch();
  // const total = Object.values(values).reduce(
  //   (sum, v) => sum + parseProbability(v),
  //   0,
  // );
  // const hasRootError = total !== 100;
  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="w-112.5 w-full space-y-4">
          <div className="flex h-75 flex-col gap-3">
            {action.targets.map((target) => {
              const scene = scenesByKey[target.sceneKey]!;
              return (
                <Controller
                  key={scene.key}
                  control={form.control}
                  name={scene.key}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex items-center justify-between gap-3">
                        <FieldLabel
                          className="flex-1 truncate"
                          htmlFor={field.name}
                        >
                          {scene.title}
                        </FieldLabel>
                        <ProbabilityInput
                          field={field}
                          fieldState={fieldState}
                        />
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              );
            })}
          </div>
          {form.formState.errors.root && (
            <FormError>
              ERROR
              {/* {" "}
              Le total des probabilités doit être égal à 100% (actuellement{" "}
              {total}%) */}
            </FormError>
          )}
        </div>
      </form>
    </Form>
  );
};
