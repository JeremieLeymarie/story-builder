import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/design-system/primitives/tabs";
import { ActionsFormContainer } from "./actions-form";
import {
  Toolbar,
  ToolbarHeader,
  ToolbarTitle,
} from "@/design-system/components/toolbar";
import { SceneContentFormContainer } from "./scene-content-form";
import { SideEffectsFormContainer } from "./side-effects-form";

export const SceneEditor = ({ sceneKey }: { sceneKey: string }) => {
  return (
    <Toolbar className="w-125">
      <ToolbarHeader>
        <ToolbarTitle>Edit scene</ToolbarTitle>
      </ToolbarHeader>
      <Tabs defaultValue="scene" className="w-full">
        <TabsList>
          <TabsTrigger value="scene">Scene</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="side-effects">Side Effects</TabsTrigger>
        </TabsList>

        <TabsContent value="scene">
          <SceneContentFormContainer sceneKey={sceneKey} />
        </TabsContent>
        <TabsContent value="actions">
          <ActionsFormContainer sceneKey={sceneKey} />
        </TabsContent>
        <TabsContent value="side-effects">
          <SideEffectsFormContainer sceneKey={sceneKey} />
        </TabsContent>
      </Tabs>
    </Toolbar>
  );
};
