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
import { SimpleLoader } from "@/design-system/components/simple-loader";
import { useGetScene } from "@/builder/hooks/use-get-scene";
import { Scene } from "@/lib/storage/domain";
import { useEditSceneContentForm } from "@/builder/hooks/use-edit-scene-content-form";

const SceneContentForm = ({ scene }: { scene: Scene }) => {
  const { setFirstScene } = useBuilderActions();
  const { story } = useBuilderContext();
  const { updateScene } = useBuilderActions();
  const form = useEditSceneContentForm({
    values: { title: scene.title, content: scene.content },
    onSave: (payload) => updateScene({ key: scene.key, ...payload }),
  });

  return (
    <Form {...form}>
      <form
        className="w-full space-y-4"
        onSubmit={(ev) => {
          ev.preventDefault();
        }}
      >
        <SetFirstSceneSwitch
          setFirstScene={() => setFirstScene(scene.key)}
          sceneKey={scene.key}
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
                <EditorContextProvider entityType="scene" entityKey={scene.key}>
                  <RichText
                    key={scene.key}
                    onSerializedChange={field.onChange}
                    initialState={scene.content} // TODO: check that editor is not broken when switching between scenes
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

export const SceneContentFormContainer = ({
  sceneKey,
}: {
  sceneKey: string;
}) => {
  const { scene, isLoading } = useGetScene(sceneKey);

  if (isLoading || scene === undefined) return <SimpleLoader />;

  return <SceneContentForm scene={scene} />;
};
