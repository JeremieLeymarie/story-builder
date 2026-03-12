import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/design-system/primitives";
import { FormError } from "@/design-system/components/form-error";
import { useBuilderActions } from "@/builder/hooks/use-builder-actions";
import { Action, Scene } from "@/lib/storage/domain";
import {
  useEditRandomEventForm,
  RandomEventSchema,
} from "@/builder/hooks/use-random-event-form";
import { useProbabilityMask } from "@/builder/hooks/use-probability-mask";
import { ControllerRenderProps } from "react-hook-form";

const ProbabilityInput = ({
  field,
  targetSceneKey,
  onProbabilityBlur,
}: {
  field: ControllerRenderProps<RandomEventSchema, string>;
  targetSceneKey: string;
  onProbabilityBlur: (targetSceneKey: string, value: string) => void;
}) => {
  const inputRef = useProbabilityMask();

  return (
    <Input
      className="max-w-15 min-w-15"
      value={field.value}
      onInput={(e) => {
        field.onChange(e.currentTarget.value);
      }}
      onBlur={() => {
        onProbabilityBlur(targetSceneKey, field.value);
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
  const { updateScene } = useBuilderActions();

  const { form, handleProbabilityBlur } = useEditRandomEventForm({
    defaultValues: Object.fromEntries(
      action.targets.map((target) => [
        target.sceneKey,
        `${target.probability}%`,
      ]),
    ),
    sourceScene,
    action,
    updateScene,
  });

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="w-112.5 w-full space-y-4">
          <div className="h-75">
            {action.targets.map((target) => {
              const scene = scenesByKey[target.sceneKey]!;
              return (
                <FormField
                  key={scene.key}
                  control={form.control}
                  name={scene.key}
                  render={({ field }) => (
                    <FormItem className="flex justify-between">
                      <FormLabel className="mt-3 mb-3 truncate">
                        {scene.title}
                      </FormLabel>
                      <ProbabilityInput
                        field={field}
                        targetSceneKey={target.sceneKey}
                        onProbabilityBlur={handleProbabilityBlur}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            })}
          </div>
          {form.formState.errors.root && (
            <FormError>{form.formState.errors.root.message}</FormError>
          )}
        </div>
      </form>
    </Form>
  );
};
