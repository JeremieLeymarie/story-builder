import { ConfirmDialog } from "@/design-system/components";
import { Label } from "@/design-system/primitives";
import { Switch } from "@/design-system/primitives/switch";
import { useEffect, useState } from "react";

export const SetFirstSceneSwitch = ({
  sceneKey,
  isFirstScene,
  setFirstScene,
}: {
  sceneKey: string;
  isFirstScene: boolean;
  setFirstScene: () => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(isFirstScene);

  useEffect(() => {
    setIsChecked(isFirstScene);
  }, [sceneKey, isFirstScene]);

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
          setIsChecked(true);
        }}
        open={isModalOpen}
        setOpen={setIsModalOpen}
      />
      <div className="flex h-full w-full items-center gap-2">
        <Switch
          id="set-first-scene"
          checked={isChecked}
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
