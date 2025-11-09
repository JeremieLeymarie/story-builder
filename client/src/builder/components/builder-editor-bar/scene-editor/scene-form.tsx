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
import { useSceneEditorForm } from "@/builder/hooks/use-scene-editor-form";

export const SceneForm = ({ scene }: { scene: SceneUpdatePayload }) => {
  const { updateScene, setFirstScene } = useBuilderActions();
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
              scenePayload={scene}
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
