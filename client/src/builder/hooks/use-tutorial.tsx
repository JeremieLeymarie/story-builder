import { useSafeLocalStorage } from "@/hooks/use-safe-local-storage";
import { driver, Config as DriverConfig } from "driver.js";
import { match } from "ts-pattern";
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
  introduction: z.boolean().catch(false),
  sceneContentEdition: z.boolean().catch(false),
  sceneActionsEdition: z.boolean().catch(false),
});

type TutorialProgress = z.output<typeof tutorialSchema>;
export type TutorialSection = keyof TutorialProgress;

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

const useTutorialSections = () => {
  const { setIsActive } = useTutorialStore();
  const { setTutorialCompleted } = useTutorialProgress();

  const introductionTutorial = {
    showProgress: true,
    disableActiveInteraction: true,
    stagePadding: 15,
    allowClose: false,

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
            "You can link your first action to a new scene by dragging a connection from the handle.",
          side: "right",
          nextBtnText: "Exit tutorial and try it out!",
        },
      },
    ],
    onDestroyed: () => {
      setIsActive(false);
      setTutorialCompleted("introduction");
    },
  } satisfies DriverConfig;

  const sceneContentEditionTutorial = {
    showProgress: true,
    disableActiveInteraction: true,
    allowClose: false,

    steps: [
      {
        element: "#scene-editor",
        popover: {
          title: "The scene editor",
          description:
            "This is where you can edit your scenes. All changes are automatically saved.",
        },
      },
      {
        element: `#scene-editor [data-slot="form-control"]`,
        popover: {
          title: "Scene title",
          description: "You can set the title here",
        },
      },
      {
        element: `#rich-text-editor`,
        popover: {
          title: "Scene content",
          description:
            "The content of the page is the heart of the story. This is what the player reads on every scene. You can use rich text features as you wish (text formatting, images...)",
        },
      },
      {
        element: `[role="tab"]:nth-child(2)`,
        popover: {
          title: "Actions",
          description:
            "Time to edit the choices of your player. Let's head to the action tab",
        },
      },
    ],
    onDestroyed: () => {
      setIsActive(false);
      setTutorialCompleted("sceneContentEdition");
    },
  } satisfies DriverConfig;

  const sceneActionsEditionTutorial = {
    showProgress: true,
    disableActiveInteraction: true,
    allowClose: false,

    steps: [
      {
        element: "#scene-editor",
        popover: {
          title: "The action tab",
          description:
            "Actions are the choices available to the player in the story.",
        },
      },
      {
        element: `#scene-editor [data-slot="button"]`,
        popover: {
          title: "Adding an action",
          description: "You can add an action using this button.",
        },
      },
      {
        element: "#scene-editor input:nth-child(1)",
        popover: {
          title: "Editing an action",
          description: "You can change the text of an action here.",
        },
      },
      {
        element: `#scene-editor [data-slot="button"]:nth-child(4)`,
        popover: {
          title: "Deleting an action",
          description: "You can delete an action using this button.",
        },
      },
      {
        element: `#scene-editor [data-slot="button"]:nth-child(3)`,
        popover: {
          title: "Advanced settings",
          description: `By default, all actions are shown in the game, but you can achieve a higher level of customization by using conditional action. For example, an action can be visible only if the player already visited another scene. Go check out the docs to learn more about it: ${import.meta.env.VITE_DOCS_URL}`,
        },
      },
    ],
    onDestroyed: () => {
      setIsActive(false);
      setTutorialCompleted("sceneActionsEdition");
    },
  } satisfies DriverConfig;

  return {
    introductionTutorial,
    sceneContentEditionTutorial,
    sceneActionsEditionTutorial,
  };
};

export const useTutorial = () => {
  const { isActive, setIsActive } = useTutorialStore();
  const { isTutorialCompleted } = useTutorialProgress();

  const tutorialSections = useTutorialSections();

  const start = (section: TutorialSection) => {
    if (isActive || isTutorialCompleted(section)) return;

    const activeTutorial = match(section)
      .with("introduction", () => tutorialSections.introductionTutorial)
      .with(
        "sceneContentEdition",
        () => tutorialSections.sceneContentEditionTutorial,
      )
      .with(
        "sceneActionsEdition",
        () => tutorialSections.sceneActionsEditionTutorial,
      )
      .exhaustive();

    driver(activeTutorial).drive();
    setIsActive(true);
  };

  return { start, isActive };
};
