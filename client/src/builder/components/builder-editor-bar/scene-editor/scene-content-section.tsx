import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/design-system/primitives";
import { UseFormReturn } from "react-hook-form";
import { SceneSchema, SceneUpdatePayload } from "./schema";
import { SetFirstSceneSwitch } from "./set-first-scene-switch";
import { Editor } from "@/design-system/components/editor/components/rich-text-editor";
import { WikiNode } from "@/design-system/components/editor/nodes/wiki-node";
import { WikiPlugin } from "./wiki-lexical-plugin";
import { useBuilderContext } from "@/builder/hooks/use-builder-context";
export const SceneContentSection = ({
  form,
  scenePayload,
  isFirstScene,
  setFirstScene,
}: {
  form: UseFormReturn<SceneSchema>;
  scenePayload: SceneUpdatePayload;
  isFirstScene: boolean;
  setFirstScene: () => void;
}) => {
  const { story } = useBuilderContext();

  return (
    <div className="space-y-4">
      <SetFirstSceneSwitch
        isFirstScene={isFirstScene}
        setFirstScene={setFirstScene}
        sceneKey={scenePayload.key}
      />
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="A very suspicious crossroads" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Content</FormLabel>
            <FormControl>
              <Editor
                onSerializedChange={field.onChange}
                initialState={scenePayload.content}
                editable
                className="h-[300px] max-w-[450px]"
                // Disabled until the feature is finished
                toolbarPlugins={[
                  <WikiPlugin wikiKey={story.wikiKey ?? null} />,
                ]}
                editorNodes={[WikiNode]}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
