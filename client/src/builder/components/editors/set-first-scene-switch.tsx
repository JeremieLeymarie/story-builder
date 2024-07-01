import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
} from "@/design-system/primitives";
import { Switch } from "@/design-system/primitives/switch";
import { AlertTriangleIcon } from "lucide-react";
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
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangleIcon size="20px" />
                Are you sure?
              </DialogTitle>
              <DialogDescription>
                Changing this setting will make this scene the entry point of
                your story. The current first scene will no longer be used as
                the start of your story.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsModalOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setFirstScene();
                  setIsChecked(true);
                  setIsModalOpen(false);
                }}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Switch
          id="set-first-scene"
          checked={isChecked}
          disabled={isFirstScene}
          onCheckedChange={() => {
            setIsModalOpen(true);
          }}
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
