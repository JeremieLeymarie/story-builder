import { ErrorMessage, BackdropLoader } from "@/design-system/components";
import { Form } from "@/design-system/primitives";
import { getGameService } from "@/domains/game/game-service";
import { GameScene } from "@/game/components/game-scene";
import { ThemeEditor } from "@/game/components/theme-editor/theme-editor";
import { useThemeEditorForm } from "@/game/hooks/use-theme-editor-form";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";

export const Component = () => {
  const { sceneKey, gameKey } = Route.useParams();
  const gameService = getGameService();
  const scene = useLiveQuery(
    () => gameService.getSceneData(sceneKey),
    [sceneKey, gameKey],
  );
  const form = useThemeEditorForm();
  const [formValues, setFormValues] = useState(() => form.getValues());

  useEffect(() => {
    // This is a hack since form.watch() does not work with React Compiler yet
    const callback = form.subscribe({
      formState: {
        values: true,
      },
      callback: () => setFormValues(form.getValues()),
    });
    return () => callback();
  }, [form]);

  if (scene === undefined) {
    return <BackdropLoader />;
  }

  if (scene === null) {
    console.error("Error while loading scene: ", scene);
    return <ErrorMessage />;
  }

  return (
    <>
      <Form {...form}>
        <GameScene
          scene={scene}
          isLastScene={!scene.actions.length}
          mode="theme-editor"
          theme={formValues}
        />
        <ThemeEditor form={form} values={formValues} />
      </Form>
    </>
  );
};

export const Route = createFileRoute("/game/theme-editor/$gameKey/$sceneKey")({
  component: Component,
});
