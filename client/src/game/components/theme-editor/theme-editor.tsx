import {
  Toolbar,
  ToolbarHeader,
  ToolbarTitle,
} from "@/design-system/components/toolbar";
import { useThemeEditorForm } from "../../hooks/use-theme-editor-form";
import { TitleSection } from "./title-section";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
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
import { SceneSection } from "./scene-section";
import { ScrollArea } from "@/design-system/primitives/scroll-area";
import { InfoIcon, RotateCcwIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/design-system/primitives/tooltip";

const AccordionSection = ({
  children,
  title,
}: PropsWithChildren<{ title: string }>) => {
  return (
    <AccordionItem value={title}>
      <AccordionTrigger>
        <p className="font-semibold">{title}</p>
      </AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
    </AccordionItem>
  );
};

export const GameWithThemeEditor = ({
  theme,
  scene,
  storyKey,
}: {
  theme: StoryTheme["theme"];
  scene: Scene;
  storyKey: string;
}) => {
  const oldValues = useRef(theme);
  const form = useThemeEditorForm({ theme, storyKey });
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
        theme={structuredClone(formValues)} // formValues's reference is stable, causing React Compiler to not detect theme changes
      />
      <div className="absolute top-8 right-5 flex gap-2">
        <Button variant="outline" onClick={() => form.reset(oldValues.current)}>
          <Tooltip>
            <TooltipTrigger>
              <RotateCcwIcon />
            </TooltipTrigger>
            <TooltipContent>Revert all changes</TooltipContent>
          </Tooltip>
        </Button>
        <Toolbar className="h-[85dvh] w-[350px] p-0">
          <ScrollArea className="h-full p-4">
            <ToolbarHeader>
              <div className="flex items-center gap-2">
                <ToolbarTitle>Theme Editor</ToolbarTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon size={14} />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-62">
                    Set up the theme of your story. It will be applied to every
                    scene of the story.
                  </TooltipContent>
                </Tooltip>
              </div>
            </ToolbarHeader>
            <form className="space-y-4">
              <Accordion
                type="multiple"
                defaultValue={["Title", "Buttons", "Scene"]}
              >
                <AccordionSection title="Title">
                  <TitleSection form={form} values={formValues} />
                </AccordionSection>
                <AccordionSection title="Buttons">
                  <ActionSection form={form} />
                </AccordionSection>
                <AccordionSection title="Scene">
                  <SceneSection form={form} />
                </AccordionSection>
              </Accordion>
            </form>
          </ScrollArea>
        </Toolbar>
      </div>
    </Form>
  );
};
