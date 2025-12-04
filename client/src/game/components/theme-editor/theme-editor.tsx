import { Toolbar } from "@/design-system/components/toolbar";
import { useThemeEditorForm } from "../../hooks/use-theme-editor-form";
import { TitleSection } from "./title-section";
import { useEffect, useState } from "react";
import { Button, Form } from "@/design-system/primitives";
import { GameScene } from "../game-scene";
import { Scene, StoryTheme } from "@/lib/storage/domain";

export const GameWithThemeEditor = ({
  theme,
  scene,
  storyKey,
}: {
  theme: StoryTheme["theme"];
  scene: Scene;
  storyKey: string;
}) => {
  const { form, onSubmit } = useThemeEditorForm({ theme, storyKey });
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
      <div className="absolute top-16 right-5">
        <Toolbar>
          <form className="space-y-4" onSubmit={onSubmit}>
            <TitleSection form={form} values={formValues} />
            <div className="flex justify-end">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Toolbar>
      </div>
    </Form>
  );
};
