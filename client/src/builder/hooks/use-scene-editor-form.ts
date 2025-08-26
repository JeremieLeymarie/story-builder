import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useDebouncer } from "@tanstack/react-pacer/debouncer";
import {
  SceneUpdatePayload,
  SceneSchema,
  sceneSchema,
} from "../components/builder-editor-bar/scene-editor/schema";

export const useSceneEditorForm = ({
  scene,
  onSave,
}: {
  scene: SceneUpdatePayload;
  onSave: (scene: SceneUpdatePayload) => void;
}) => {
  const form = useForm<SceneSchema>({
    resolver: zodResolver(sceneSchema),
    defaultValues: {
      content: scene?.content,
      title: scene?.title,
      actions: scene?.actions,
    },
  });

  const debouncer = useDebouncer(
    (scene) => {
      form.handleSubmit((values: SceneSchema) => {
        onSave({
          key: scene.key,
          storyKey: scene.storyKey,
          actions: values.actions,
          content: values.content,
          title: values.title,
        });
      })();
    },
    { wait: 500 },
    () => {}, // Never re-render when internal debouncer state changes
  );

  useEffect(() => {
    // Update the form when the default values change, which are 'cached' otherwise
    if (scene) form.reset(scene);
  }, [scene, form, debouncer]);

  useEffect(() => {
    const callback = form.subscribe({
      formState: {
        values: true,
      },
      callback: () => debouncer.maybeExecute(scene),
    });
    return () => callback();
  }, [debouncer, form, scene]);

  return form;
};
