import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/design-system/primitives/tabs";
import { SceneUpdatePayload } from "./schema";
import { SceneContentForm } from "./scene-content-form";
import { ActionsForm } from "./actions-form";
import {
  ToolbarHeader,
  ToolbarTitle,
} from "@/design-system/components/toolbar";
import { useEditSceneContentForm } from "@/builder/hooks/use-edit-scene-content-form";
import { useBuilderActions } from "@/builder/hooks/use-builder-actions";
import { useEditActionsForm } from "@/builder/hooks/use-edit-actions-form";

export const SceneEditorHeader = () => {
  return (
    <ToolbarHeader>
      <ToolbarTitle>Edit scene</ToolbarTitle>
    </ToolbarHeader>
  );
};

export const SceneEditor = ({ scene }: { scene: SceneUpdatePayload }) => {
  // Both forms have to be declared here instead of in each form component because tabs are unmounted
  // when inactive, which causes data freshness issues when switching tabs
  // This is the simplest workaround
  const { updateScene, makeEmptyActionPayload } = useBuilderActions();
  const contentForm = useEditSceneContentForm({
    values: { title: scene.title, content: scene.content },
    onSave: (payload) => updateScene({ key: scene.key, ...payload }),
  });
  const actionFormProps = useEditActionsForm({
    actions: scene.actions,
    onSave: (payload) => updateScene({ key: scene.key, ...payload }),
  });

  return (
    <Tabs defaultValue="scene" className="w-full">
      <TabsList>
        <TabsTrigger value="scene">Scene</TabsTrigger>
        <TabsTrigger value="actions">Actions</TabsTrigger>
      </TabsList>

      <TabsContent value="scene">
        <SceneContentForm
          form={contentForm}
          sceneKey={scene.key}
          content={scene.content}
        />
      </TabsContent>
      <TabsContent value="actions">
        <ActionsForm
          actionFormProps={actionFormProps}
          makeEmptyActionPayload={makeEmptyActionPayload}
        />
      </TabsContent>
    </Tabs>
  );
};
