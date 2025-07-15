import { useNewEditorStore } from "./hooks/use-new-editor-store";
import { useBuilderContext } from "../../hooks/use-builder-store";
import { Scene } from "@/lib/storage/domain";
import { WithoutKey } from "@/types";
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
import { SceneSchema, sceneSchema } from "./schema";
import { ActionsSection } from "./actions-section";
import { useDebouncedCallback } from "@tanstack/react-pacer/debouncer";
import { getBuilderService } from "@/get-builder-service";

export const NewEditor = ({
  onSave,
}: {
  onSave: (scene: WithoutKey<Scene> | Scene) => void;
}) => {
  const { isOpen, sceneKey } = useNewEditorStore();
  const { scenes } = useBuilderContext();
  const scene = scenes.find((s) => s.key === sceneKey);

  if (!scene || !isOpen) return null;

  return <NewEditorContent scene={scene} onSave={onSave} />;
};

const NewEditorContent = ({
  scene,
}: {
  onSave: (scene: WithoutKey<Scene> | Scene) => void;
  scene: Scene;
}) => {
  const form = useForm<SceneSchema>({
    resolver: zodResolver(sceneSchema),
    defaultValues: {
      content: scene?.content,
      title: scene?.title,
    },
  });

  useEffect(() => {
    // Update the form when the default values change, which are 'cached' otherwise
    if (scene) form.reset(scene);
  }, [scene, form]);

  const submit = useDebouncedCallback(
    form.handleSubmit((values: SceneSchema) => {
      console.log("hihi", values);
      // TODO: update react flow directly
      getBuilderService().updateScene({ ...scene, ...values });
    }),
    { wait: 500 },
  );

  useEffect(() => {
    const callback = form.subscribe({
      formState: {
        values: true,
      },
      callback: () => submit(),
    });

    return () => callback();
  }, [form, submit]);

  // TODO: take inspiration from dialog's animations & extract into reusable ui component

  // TODO: handle scene creation

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
