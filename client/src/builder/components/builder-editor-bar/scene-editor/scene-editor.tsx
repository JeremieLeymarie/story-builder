import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/design-system/primitives/tabs";
import { ActionsFormContainer } from "./actions-form";
import {
  ToolbarHeader,
  ToolbarTitle,
} from "@/design-system/components/toolbar";
import { SceneUpdatePayload } from "@/builder/hooks/use-builder-editor-store";
import { SceneContentFormContainer } from "./scene-content-form";

export const SceneEditorHeader = () => {
  return (
    <ToolbarHeader>
      <ToolbarTitle>Edit scene</ToolbarTitle>
    </ToolbarHeader>
  );
};

export const SceneEditor = ({ scene }: { scene: SceneUpdatePayload }) => {
  return (
    <Tabs defaultValue="scene" className="w-full">
      <TabsList>
        <TabsTrigger value="scene">Scene</TabsTrigger>
        <TabsTrigger value="actions">Actions</TabsTrigger>
      </TabsList>

      <TabsContent value="scene">
        <SceneContentFormContainer sceneKey={scene.key} />
      </TabsContent>
      <TabsContent value="actions">
        <ActionsFormContainer sceneKey={scene.key} />
      </TabsContent>
    </Tabs>
  );
};
