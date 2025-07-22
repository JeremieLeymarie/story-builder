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
import { SceneSchema } from "./schema";
import { SetFirstSceneSwitch } from "./set-first-scene-switch";
import { Editor } from "@/design-system/components/editor/blocks/editor";
import { SerializedEditorState } from "lexical";

export const SceneContentSection = ({
  form,
  sceneKey,
  isFirstScene,
  setFirstScene,
}: {
  form: UseFormReturn<SceneSchema>;
  sceneKey: string;
  isFirstScene: boolean;
  setFirstScene: () => void;
}) => {
  return (
    <div className="space-y-4">
      <SetFirstSceneSwitch
        isFirstScene={isFirstScene}
        setFirstScene={setFirstScene}
        sceneKey={sceneKey}
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
                editable={true}
                sceneKey={sceneKey}
                onSerializedChange={(data) => {
                  field.onChange(data);
                }}
                editorSerializedState={
                  field.value as unknown as SerializedEditorState
                }
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
