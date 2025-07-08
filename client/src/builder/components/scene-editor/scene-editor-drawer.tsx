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
  onSave,
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

  const submit = (values: SceneSchema) => {
    // onSave(values);
    close();
  };

  // TODO: submit on change

  // TODO: take inspiration from dialog's animations & extract into reusable ui component

  // TODO: handle scene creation

  // TODO: add shortcuts to tabs
  return (
    <div className="z-50 min-w-[450px] rounded border bg-white/95 p-4 shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)} className="w-full">
          <Tabs defaultValue="scene" className="w-[400px]">
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
