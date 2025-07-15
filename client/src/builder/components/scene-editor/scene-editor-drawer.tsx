import { useSceneEditorStore } from "./hooks/use-scene-editor-store";
import { SceneContentSection } from "./scene-content-section";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/design-system/primitives/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Form } from "@/design-system/primitives";
import { SceneSchema, sceneSchema, SceneUpdatePayload } from "./schema";
import { ActionsSection } from "./actions-section";
import { useDebouncer } from "@tanstack/react-pacer/debouncer";
import { useBuilderActions } from "@/builder/hooks/use-builder-actions";

export const NewEditor = ({
  onSave,
}: {
  onSave: (scene: SceneUpdatePayload) => void;
}) => {
  const { isOpen, scene, isFirstScene } = useSceneEditorStore();

  if (!scene || !isOpen || isFirstScene === null) return null;

  return (
    <NewEditorContent
      scene={scene}
      onSave={onSave}
      isFirstScene={isFirstScene}
    />
  );
};

const NewEditorContent = ({
  scene,
  isFirstScene,
  onSave,
}: {
  scene: SceneUpdatePayload;
  isFirstScene: boolean;
  onSave: (scene: SceneUpdatePayload) => void;
}) => {
  const { setFirstScene } = useBuilderActions();
  const form = useForm<SceneSchema>({
    resolver: zodResolver(sceneSchema),
    defaultValues: {
      content: scene?.content,
      title: scene?.title,
      actions: scene?.actions,
    },
  });

  const debouncer = useDebouncer(
    (scene) => {
      form.handleSubmit((values: SceneSchema) => {
        onSave({
          key: scene.key,
          storyKey: scene.storyKey,
          actions: values.actions,
          content: values.content,
          title: values.title,
        });
      })();
    },
    { wait: 500 },
    () => {}, // Never re-render when internal debouncer state changes
  );

  useEffect(() => {
    // Update the form when the default values change, which are 'cached' otherwise
    if (scene) form.reset(scene);
  }, [scene, form, debouncer]);

  useEffect(() => {
    const callback = form.subscribe({
      formState: {
        values: true,
      },
      callback: () => debouncer.maybeExecute(scene),
    });
    return () => callback();
  }, [debouncer, form, scene]);

  // TODO: take inspiration from dialog's animations & extract this drawer into a reusable ui component

  // TODO: add shortcuts to tabs

  console.log({ scene, isFirstScene });
  return (
    <div className="z-50 min-w-[450px] rounded border bg-white/95 p-4 shadow-sm">
      <Form {...form}>
        <form className="w-full">
          <Tabs defaultValue="scene" className="w-full">
            <TabsList>
              <TabsTrigger value="scene">Scene</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="scene">
              <SceneContentSection
                form={form}
                sceneKey={scene.key}
                isFirstScene={isFirstScene}
                setFirstScene={() => setFirstScene(scene.key)}
              />
            </TabsContent>
            <TabsContent value="actions">
              <ActionsSection form={form} />
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
};
