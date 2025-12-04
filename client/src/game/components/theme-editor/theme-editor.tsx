import { Toolbar } from "@/design-system/components/toolbar";
import {
  ThemeEditorForm,
  ThemeEditorSchema,
  useThemeEditorForm,
} from "../../hooks/use-theme-editor-form";
import { TitleSection } from "./title-section";
import { useEffect, useState } from "react";
import { Form } from "@/design-system/primitives";
import { GameScene } from "../game-scene";
import { Scene, StoryTheme } from "@/lib/storage/domain";

export const GameWithThemeEditor = ({
  theme,
  scene,
}: {
  theme: StoryTheme["theme"];
  scene: Scene;
}) => {
  const form = useThemeEditorForm({ theme });
  const [formValues, setFormValues] = useState(() => form.getValues());

  useEffect(() => {
    // This is a hack since form.watch() does not work with React Compiler yet
    const callback = form.subscribe({
      formState: {
        values: true,
      },
      callback: () => setFormValues(form.getValues()),
    });
    return () => callback();
  }, [form]);

  return (
    <Form {...form}>
      <GameScene
        scene={scene}
        isLastScene={!scene.actions.length}
        mode="theme-editor"
        theme={formValues}
      />
      <ThemeEditor form={form} values={formValues} />
    </Form>
  );
};

export const ThemeEditor = ({
  form,
  values,
}: {
  form: ThemeEditorForm;
  values: ThemeEditorSchema;
}) => {
  return (
    <div className="absolute top-16 right-5">
      <Toolbar>
        <form className="space-y-4">
          <TitleSection form={form} values={values} />
        </form>
      </Toolbar>
    </div>
  );
};
