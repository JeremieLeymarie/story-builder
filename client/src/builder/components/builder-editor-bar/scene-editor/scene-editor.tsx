import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/design-system/primitives/tabs";
import { SceneUpdatePayload } from "./schema";
import { SceneContentForm } from "./scene-content-form";
import { ActionsForm } from "./actions-form";

export const SceneEditor = ({ scene }: { scene: SceneUpdatePayload }) => {
  return (
    <Tabs defaultValue="scene" className="w-full">
      <TabsList>
        <TabsTrigger value="scene">Scene</TabsTrigger>
        <TabsTrigger value="actions">Actions</TabsTrigger>
      </TabsList>

      <TabsContent value="scene">
        <SceneContentForm scenePayload={scene} />
      </TabsContent>
      <TabsContent value="actions">
        <ActionsForm sceneKey={scene.key} actions={scene.actions} />
      </TabsContent>
    </Tabs>
  );
};
