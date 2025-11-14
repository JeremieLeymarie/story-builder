import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useDebouncer } from "@tanstack/react-pacer/debouncer";
import {
  SceneUpdatePayload,
  SceneSchema,
  sceneSchema,
  SceneEditorActionSchema,
} from "../components/builder-editor-bar/scene-editor/schema";
import { Action } from "@/lib/storage/domain";
import { match } from "ts-pattern";

const adaptDomainAction = (action: Action) => {
  return match<Action, SceneEditorActionSchema>(action)
    .with({ type: "conditional" }, (a) => ({
      showCondition:
        a.condition.type === "user-did-visit"
          ? "when-user-did-visit"
          : "when-user-did-not-visit",
      text: a.text,
      sceneKey: a.sceneKey,
      targetSceneKey: a.condition.sceneKey,
    }))
    .with({ type: "simple" }, (a) => ({
      showCondition: "always",
      text: a.text,
      sceneKey: a.sceneKey,
    }))
    .exhaustive();
};

const adaptFormAction = (formAction: SceneEditorActionSchema) => {
  return match<SceneEditorActionSchema, Action>(formAction)
    .with({ showCondition: "always" }, (a) => ({
      type: "simple",
      text: a.text,
      sceneKey: a.sceneKey,
    }))
    .with({ showCondition: "when-user-did-visit" }, (a) => ({
      type: "conditional",
      text: a.text,
      sceneKey: a.sceneKey,
      condition: { type: "user-did-visit", sceneKey: a.targetSceneKey },
    }))
    .with({ showCondition: "when-user-did-not-visit" }, (a) => ({
      type: "conditional",
      text: a.text,
      sceneKey: a.sceneKey,
      condition: { type: "user-did-not-visit", sceneKey: a.targetSceneKey },
    }))
    .exhaustive();
};

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
      actions: scene.actions.map(adaptDomainAction),
    },
  });

  const debouncer = useDebouncer(
    (scene) => {
      form.handleSubmit((values: SceneSchema) => {
        onSave({
          key: scene.key,
          storyKey: scene.storyKey,
          actions: values.actions.map(adaptFormAction),
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
    if (scene)
      form.reset({
        content: scene?.content,
        title: scene?.title,
        actions: scene.actions.map(adaptDomainAction),
      });
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
