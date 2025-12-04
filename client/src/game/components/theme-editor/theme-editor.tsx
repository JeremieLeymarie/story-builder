import { Toolbar } from "@/design-system/components/toolbar";
import { useThemeEditorForm } from "../../hooks/use-theme-editor-form";
import { TitleSection } from "./title-section";
import { useEffect, useState } from "react";
import { Button, Form } from "@/design-system/primitives";
import { GameScene } from "../game-scene";
import { Scene, StoryTheme } from "@/lib/storage/domain";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/design-system/primitives/accordion";
import { ActionSection } from "./action-section";

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

  console.log(formValues);

  return (
    <Form {...form}>
      <GameScene
        scene={scene}
        isLastScene={!scene.actions.length}
        mode="theme-editor"
        theme={structuredClone(formValues)} // formValues's reference is stable, causing React Compiler to not detect theme changes
      />
      <div className="absolute top-16 right-5">
        <Toolbar className="w-[350px]">
          <form className="space-y-4" onSubmit={onSubmit}>
            <Accordion type="multiple" defaultValue={["title", "buttons"]}>
              <AccordionItem value="title">
                <AccordionTrigger>
                  <p className="font-semibold">Title</p>
                </AccordionTrigger>
                <AccordionContent>
                  <TitleSection form={form} values={formValues} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="buttons">
                <AccordionTrigger>
                  <p className="font-semibold">Buttons</p>
                </AccordionTrigger>
                <AccordionContent>
                  <ActionSection form={form} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex justify-end">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Toolbar>
      </div>
    </Form>
  );
};
