import { ConfirmDialog } from "@/design-system/components";
import { Label } from "@/design-system/primitives";
import { Switch } from "@/design-system/primitives/switch";
import { useState } from "react";

export const SetFirstSceneSwitch = ({
  isFirstScene,
  setFirstScene,
}: {
  isFirstScene: boolean;
  setFirstScene: () => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(isFirstScene);

  return (
    <div className="w-full p-3 border-primary border rounded-[--radius]">
      <div className="w-full flex items-center gap-2">
        <ConfirmDialog
          title="Are you sure?"
          description="Changing this setting will make this scene the entry point of
                your story. The current first scene will no longer be used as
                the start of your story."
          confirmLabel="Download"
          onConfirm={() => {
            setFirstScene();
            setIsChecked(true);
          }}
          open={isModalOpen}
          setOpen={setIsModalOpen}
        />
        <Switch
          id="set-first-scene"
          checked={isChecked}
          disabled={isFirstScene}
          onCheckedChange={() => setIsModalOpen(true)}
        />
        <Label htmlFor="set-first-scene">
          {isFirstScene
            ? "This scene is the first scene of the story"
            : "Use as first scene"}
        </Label>
      </div>
    </div>
  );
};
