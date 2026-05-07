import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/design-system/primitives/tabs";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/design-system/primitives";
import { ActionsFormContainer } from "./actions-form";
import {
  Toolbar,
  ToolbarHeader,
  ToolbarTitle,
} from "@/design-system/components/toolbar";
import { useBuilderEditorStore } from "@/builder/hooks/use-builder-editor-store";
import { useDeleteSceneStore } from "@/builder/hooks/use-delete-scenes-store";
import { SceneContentFormContainer } from "./scene-content-form";
import { SideEffectsFormContainer } from "./side-effects-form";

export const SceneEditor = ({ sceneKey }: { sceneKey: string }) => {
  const isFirstScene = useBuilderEditorStore(
    (state) =>
      state.editor?.type === "scene-editor" &&
      state.editor.payload.isFirstScene,
  );
  const openDeleteConfirm = useDeleteSceneStore((state) => state.open);

  return (
    <Toolbar className="w-125" id="scene-editor">
      <ToolbarHeader className="flex-row items-center justify-between">
        <ToolbarTitle>Edit scene</ToolbarTitle>
        {!isFirstScene && (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => openDeleteConfirm([sceneKey])}
          >
            <Trash2Icon />
          </Button>
        )}
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
