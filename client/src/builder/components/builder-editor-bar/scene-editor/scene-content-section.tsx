import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/design-system/primitives";
import { UseFormReturn } from "react-hook-form";
import { SceneSchema, SceneUpdatePayload } from "./schema";
import { SetFirstSceneSwitch } from "./set-first-scene-switch";
import { Editor } from "@/design-system/components/editor/blocks/editor";
import { SerializedEditorState } from "lexical";

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
  console.log({ scenePayload });
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
            <FormDescription>The displayed title of the scene</FormDescription>
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
                editorSerializedState={
                  scenePayload.content as unknown as SerializedEditorState
                }
                editable
              />
            </FormControl>
            <FormDescription>The actual content of the scene.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
