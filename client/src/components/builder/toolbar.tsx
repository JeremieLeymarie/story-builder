import { Button } from "@/design-system/primitives";
import { BookOpenTextIcon } from "lucide-react";
import { SceneEditor } from "./scene-editor";
import { getRepository } from "@/lib/storage/indexed-db-repository";

type Props = { storyId: number };
export const Toolbar = ({ storyId }: Props) => {
  return (
    <div className="w-[275px] border-r p-2">
      <p className="text-2xl font-semibold text-primary">Tools</p>
      <hr />
      <div className="mt-2">
        <SceneEditor
          trigger={
            <Button variant="outline">
              <BookOpenTextIcon />
              &nbsp; Add a scene
            </Button>
          }
          onSave={(values) =>
            getRepository().createScene({ ...values, actions: [], storyId })
          }
        />
      </div>
    </div>
  );
};
