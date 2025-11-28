import { useTestStory } from "./use-test-story";
import { useAddScene } from "./use-add-scene";
import { useBuilderEditorStore } from "./use-scene-editor-store";
import { useSafeLocalStorage } from "@/hooks/use-safe-local-storage";
import {
  USER_SETTINGS_KEY,
  userSettingsSchema,
} from "@/lib/storage/local-storage";
import { produce } from "immer";

export const useToolbarActions = () => {
  const { testStory } = useTestStory();
  const { addScene } = useAddScene();
  const openBuilderEditor = useBuilderEditorStore((state) => state.open);

  return {
    testStory,
    addScene,
    openBuilderEditor,
  };
};

export const useToolbar = () => {
  const [userSettings, setUserSettings] = useSafeLocalStorage(
    USER_SETTINGS_KEY,
    userSettingsSchema,
  );

  const toggleExpanded = () =>
    setUserSettings((prev) =>
      produce(prev, (draft) => {
        draft.builder.toolbarExpanded = !draft.builder.toolbarExpanded;
      }),
    );

  return {
    isExpanded: userSettings.builder.toolbarExpanded,
    toggleExpanded,
  };
};
