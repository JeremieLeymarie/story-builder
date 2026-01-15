import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/design-system/primitives";
import { SetFirstSceneSwitch } from "./set-first-scene-switch";
import { RichText } from "@/design-system/components/editor/components/rich-text-editor";
import { useBuilderContext } from "@/builder/hooks/use-builder-context";
import { EditorContextProvider } from "@/design-system/components/editor/hooks/use-editor-context";
import { WikiPlugin } from "../../wiki-lexical-plugin/wiki-lexical-plugin";
import { WikiNode } from "@/builder/lexical-wiki-node";
import { useBuilderActions } from "@/builder/hooks/use-builder-actions";
import { SceneContentFormType } from "@/builder/hooks/use-edit-scene-content-form";
import { LexicalContent } from "@/lib/lexical-content";

export const SceneContentForm = ({
  form,
  sceneKey,
  content,
}: {
  form: SceneContentFormType;
  sceneKey: string;
  content: LexicalContent;
}) => {
  const { setFirstScene } = useBuilderActions();
  const { story } = useBuilderContext();

  return (
    <Form {...form}>
      <form
        className="w-full space-y-4"
        onSubmit={(ev) => {
          ev.preventDefault();
        }}
      >
        <SetFirstSceneSwitch
          setFirstScene={() => setFirstScene(sceneKey)}
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
                <EditorContextProvider entityType="scene" entityKey={sceneKey}>
                  <RichText
                    key={sceneKey}
                    onSerializedChange={field.onChange}
                    initialState={content}
                    editable
                    className="h-75 max-w-112.5"
                    toolbarPlugins={[
                      <WikiPlugin wikiKey={story.wikiKey ?? null} />,
                    ]}
                    editorNodes={[WikiNode]}
                    textDisplayMode="scroll"
                  />
                </EditorContextProvider>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
