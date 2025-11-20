import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/design-system/primitives";
import { SceneUpdatePayload } from "./schema";
import { SetFirstSceneSwitch } from "./set-first-scene-switch";
import { RichText } from "@/design-system/components/editor/components/rich-text-editor";
import { useBuilderContext } from "@/builder/hooks/use-builder-context";
import { EditorContext } from "@/design-system/components/editor/hooks/use-editor-context";
import { WikiPlugin } from "../../wiki-lexical-plugin/wiki-lexical-plugin";
import { WikiNode } from "@/builder/lexical-wiki-node";
import { useEditSceneContentForm } from "@/builder/hooks/use-edit-scene-content-form";
import { useBuilderActions } from "@/builder/hooks/use-builder-actions";

export const SceneContentForm = ({
  scenePayload,
}: {
  scenePayload: SceneUpdatePayload;
}) => {
  const { updateScene, setFirstScene } = useBuilderActions();
  const { story } = useBuilderContext();
  const form = useEditSceneContentForm({
    defaultValues: { title: scenePayload.title, content: scenePayload.content },
    onSave: (payload) => updateScene({ key: scenePayload.key, ...payload }),
  });

  return (
    <Form {...form}>
      <form
        className="w-full space-y-4"
        onSubmit={(ev) => {
          ev.preventDefault();
        }}
      >
        <div>
          <SetFirstSceneSwitch
            setFirstScene={() => setFirstScene(scenePayload.key)}
            sceneKey={scenePayload.key}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="A very suspicious crossroads"
                    {...field}
                  />
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
                  <EditorContext
                    value={{ entityType: "scene", entityKey: scenePayload.key }}
                  >
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
                  </EditorContext>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};
