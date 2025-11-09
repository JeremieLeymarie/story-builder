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
import { RichText } from "@/design-system/components/editor/components/rich-text-editor";
import { WikiNode } from "@/design-system/components/editor/nodes/wiki-node";
import { WikiPlugin } from "./wiki-lexical-plugin";
import { useBuilderContext } from "@/builder/hooks/use-builder-context";
export const SceneContentSection = ({
  form,
  scenePayload,
  setFirstScene,
}: {
  form: UseFormReturn<SceneSchema>;
  scenePayload: SceneUpdatePayload;
  setFirstScene: () => void;
}) => {
  const { story } = useBuilderContext();

  return (
    <div className="space-y-4">
      <SetFirstSceneSwitch
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
              <RichText
                onSerializedChange={field.onChange}
                initialState={scenePayload.content}
                editable
                className="h-[300px] max-w-[450px]"
                toolbarPlugins={[
                  <WikiPlugin wikiKey={story.wikiKey ?? null} />,
                ]}
                editorNodes={[WikiNode]}
                textDisplayMode="scroll"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
