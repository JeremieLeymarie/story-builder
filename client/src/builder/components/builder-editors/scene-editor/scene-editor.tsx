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

export const SceneEditorContent = ({
  scene,
  isFirstScene,
}: {
  scene: SceneUpdatePayload;
  isFirstScene: boolean;
}) => {
  const { updateScene } = useBuilderActions();

  const { setFirstScene } = useBuilderActions();
  const form = useSceneEditorForm({ onSave: updateScene, scene });

  return (
    <Form {...form}>
      <form
        className="w-full"
        onSubmit={(ev) => {
          ev.preventDefault();
        }}
      >
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
  );
};
