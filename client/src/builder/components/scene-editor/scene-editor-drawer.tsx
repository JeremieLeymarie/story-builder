import { useSceneEditorStore } from "./hooks/use-scene-editor-store";
import { SceneContentSection } from "./scene-content-section";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/design-system/primitives/tabs";
import { Form } from "@/design-system/primitives";
import { SceneUpdatePayload } from "./schema";
import { ActionsSection } from "./actions-section";
import { useBuilderActions } from "@/builder/hooks/use-builder-actions";
import { useSceneEditorForm } from "./hooks/use-scene-editor-form";

export const SceneEditor = ({
  onSave,
}: {
  onSave: (scene: SceneUpdatePayload) => void;
}) => {
  const { isOpen, scene, isFirstScene } = useSceneEditorStore();

  if (!scene || !isOpen || isFirstScene === null) return null;

  return (
    <SceneEditorContent
      scene={scene}
      onSave={onSave}
      isFirstScene={isFirstScene}
    />
  );
};

const SceneEditorContent = ({
  scene,
  isFirstScene,
  onSave,
}: {
  scene: SceneUpdatePayload;
  isFirstScene: boolean;
  onSave: (scene: SceneUpdatePayload) => void;
}) => {
  const { setFirstScene } = useBuilderActions();
  const form = useSceneEditorForm({ onSave, scene });

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
