import { TutorialSection, useTutorial } from "@/builder/hooks/use-tutorial";
import { useEffect } from "react";

export const useSceneEditorTutorial = (tutorial: TutorialSection) => {
  const { start } = useTutorial();

  useEffect(() => {
    console.log(tutorial);
    start(tutorial);
  }, [start, tutorial]);
};
