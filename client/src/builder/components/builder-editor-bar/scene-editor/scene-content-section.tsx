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
import { SerializedEditorState } from "lexical";
import { RichText } from "@/design-system/components/editor/components/rich-text-editor";

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
              <RichText
                onSerializedChange={field.onChange}
                initialState={
                  scenePayload.content as unknown as SerializedEditorState
                }
                editable
                className="h-[300px] max-w-[450px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
