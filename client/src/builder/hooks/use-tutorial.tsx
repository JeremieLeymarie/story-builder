import { useSafeLocalStorage } from "@/hooks/use-safe-local-storage";
import { driver } from "driver.js";
import z from "zod";
import { create } from "zustand";

type ExportModalStore = {
  isActive: boolean;
  setIsActive: (active: boolean) => void;
};

export const useTutorialStore = create<ExportModalStore>((set) => ({
  isActive: false,
  setIsActive(isActive) {
    set({ isActive });
  },
}));

const TUTORIAL_LS_KEY = "tutorial-progress";

const tutorialSchema = z.object({
  initial: z.boolean().catch(false),
  sceneCreation: z.boolean().catch(false),
});

type TutorialProgress = z.output<typeof tutorialSchema>;
type TutorialSection = keyof TutorialProgress;

const useTutorialProgress = () => {
  const [progress, setProgress] = useSafeLocalStorage(
    TUTORIAL_LS_KEY,
    tutorialSchema,
  );

  const setTutorialCompleted = (section: TutorialSection) => {
    setProgress((prev) => ({ ...prev, [section]: true }));
  };

  const isTutorialCompleted = (section: TutorialSection) => progress[section];

  return { setTutorialCompleted, isTutorialCompleted };
};

export const useTutorial = () => {
  const { isActive, setIsActive } = useTutorialStore();
  const { isTutorialCompleted, setTutorialCompleted } = useTutorialProgress();

  const tutorial = driver({
    showProgress: true,
    disableActiveInteraction: true,
    stagePadding: 15,

    steps: [
      {
        element: "#first-scene",
        popover: {
          title: "Welcome to the Builder!",
          description:
            "This is where you can create your story! Once you've created a story, you will be able to share it with your friends. A story is made of a collection. You can think of a scene like a page in a book.",
        },
      },
      {
        element: `#first-scene [data-slot="card-title"]`,
        popover: {
          title: "Title",
          description:
            "A scene must have a title, which will be displayed to your player at the top of the page.",
          side: "top",
        },
      },
      {
        element: `#first-scene [data-slot="card-content"]`,
        popover: {
          title: "Actions",
          description:
            "Actions are the choices at the end of the scene (or page). In the game they are represented by buttons that lead to a specific page.",
          side: "right",
        },
      },
      {
        element: `#first-scene [data-slot="card-content"] div:nth-child(1)`,
        popover: {
          title: "Actions",
          description:
            "Each item can lead to a different scene of the story. The text will be displayed in a button in the game. Try to link your first action to a new scene by dragging a connection from the handle.",
          side: "right",
        },
      },
      {
        element: `#first-scene [data-slot="card-content"] .react-flow__handle:nth-child(1)`,
        popover: {
          title: "Link your first action",
          description:
            "Try to link your first action to a new scene by dragging a connection from the handle.",
          side: "right",
          nextBtnText: "Exit tutorial",
        },
      },
    ],
    onDestroyed: () => {
      setIsActive(false);
      setTutorialCompleted("initial");
    },
  });

  const start = (section: TutorialSection) => {
    if (isActive || isTutorialCompleted(section)) return;

    tutorial.drive();
    setIsActive(true);
  };

  return { start, isActive };
};
