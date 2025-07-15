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
import { useEffect, useRef } from "react";
import { Form } from "@/design-system/primitives";
import { SceneSchema, sceneSchema, SceneUpdatePayload } from "./schema";
import { ActionsSection } from "./actions-section";
import { useDebouncer } from "@tanstack/react-pacer/debouncer";

export const NewEditor = ({
  onSave,
}: {
  onSave: (scene: SceneUpdatePayload) => void;
}) => {
  const { isOpen, scene } = useSceneEditorStore();

  if (!scene || !isOpen) return null;

  return <NewEditorContent scene={scene} onSave={onSave} />;
};

const NewEditorContent = ({
  scene,
  onSave,
}: {
  onSave: (scene: SceneUpdatePayload) => void;
  scene: SceneUpdatePayload;
}) => {
  const form = useForm<SceneSchema>({
    resolver: zodResolver(sceneSchema),
    defaultValues: {
      content: scene?.content,
      title: scene?.title,
    },
  });

  const sceneKey = useRef<string>(scene.key);

  const debouncer = useDebouncer(
    () => {
      form.handleSubmit((values: SceneSchema) => {
        // The lifecycle management is a bit dicey here: switching to another scene does not unmount this component,
        // so we need to avoid firing changes with the wrong sceneKey
        // For now this works, but we should look into why this problem occurs
        if (scene.key !== sceneKey.current) return;
        onSave({
          ...scene,
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
    if (scene) {
      form.reset(scene);
      if (sceneKey.current !== scene.key) {
        sceneKey.current = scene.key;
        debouncer.cancel();
      }
    }
  }, [scene, form, debouncer]);

  useEffect(() => {
    const callback = form.subscribe({
      formState: {
        values: true,
      },
      callback: () => debouncer.maybeExecute(),
    });
    return () => callback();
  }, [debouncer, form]);

  // TODO: handle first scene update

  // TODO: take inspiration from dialog's animations & extract this drawer into a reusable ui component

  // TODO: add shortcuts to tabs
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
              <SceneContentSection form={form} />
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
