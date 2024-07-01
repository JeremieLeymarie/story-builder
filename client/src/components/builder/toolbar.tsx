import { Button } from "@/design-system/primitives";
import { BookOpenTextIcon, RefreshCcwIcon } from "lucide-react";
import { SceneEditor } from "./scene-editor";
import { getRepository } from "@/lib/storage/indexed-db-repository";
import { useToolbar } from "./hooks/use-toolbar";

type Props = { storyId: number };
export const Toolbar = ({ storyId }: Props) => {
  const { synchronize } = useToolbar({ storyId });

  return (
    <div className="w-[275px] border-r p-2">
      <p className="text-2xl font-semibold text-primary">Tools</p>
      <hr />
      <div className="mt-2 w-full flex flex-col gap-2">
        <SceneEditor
          trigger={
            <Button variant="outline" className="w-full">
              <BookOpenTextIcon size="16px" />
              &nbsp; Add a scene
            </Button>
          }
          triggerClassName="w-full"
          onSave={(values) =>
            getRepository().createScene({
              ...values,
              storyId,
              builderParams: { position: { x: 0, y: 0 } },
            })
          }
        />
        <Button variant="outline" className="w-full" onClick={synchronize}>
          <RefreshCcwIcon size="16px" /> &nbsp; Synchronize
        </Button>
      </div>
    </div>
  );
};
