import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from "@/design-system/primitives";
import { UseFormReturn } from "react-hook-form";
import { SceneSchema } from "./schema";
import { SetFirstSceneSwitch } from "./set-first-scene-switch";

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
              <Textarea
                placeholder="You're at a crossroads. On the left, the forest, on the right, the village."
                className="min-h-[300px]"
                {...field}
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
