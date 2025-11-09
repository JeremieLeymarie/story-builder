import { useBuilderContext } from "@/builder/hooks/use-builder-context";
import { ConfirmDialog } from "@/design-system/components";
import { Label } from "@/design-system/primitives";
import { Switch } from "@/design-system/primitives/switch";
import { useState } from "react";

export const SetFirstSceneSwitch = ({
  sceneKey,
  setFirstScene,
}: {
  sceneKey: string;
  setFirstScene: () => void;
}) => {
  const { story } = useBuilderContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isFirstScene = story.firstSceneKey === sceneKey;

  return (
    <div className="border-primary h-10 w-full rounded-(--radius) border px-3">
      <ConfirmDialog
        title="Are you sure?"
        description="Changing this setting will make this scene the entry point of
          your story. The current first scene will no longer be used as
          the start of your story."
        confirmLabel="Confirm"
        onConfirm={() => {
          setFirstScene();
        }}
        open={isModalOpen}
        setOpen={setIsModalOpen}
      />
      <div className="flex h-full w-full items-center gap-2">
        <Switch
          id="set-first-scene"
          checked={isFirstScene}
          disabled={isFirstScene}
          onCheckedChange={() => setIsModalOpen(true)}
        />
        <Label htmlFor="set-first-scene" className="text-sm">
          {isFirstScene
            ? "This scene is the first scene of the story"
            : "Use as first scene"}
        </Label>
      </div>
    </div>
  );
};
