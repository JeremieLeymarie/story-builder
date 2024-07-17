import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/design-system/primitives/card";
import { Handle, NodeProps, Position } from "reactflow";
import { SceneEditor } from "../../components/editors/scene-editor";
import { EditIcon } from "lucide-react";
import { getLocalRepository } from "@/lib/storage/dexie/indexed-db-repository";
import { SceneProps } from "../../types";
import { cn } from "@/lib/style";

export type SceneNodeProps = NodeProps<SceneProps>;

export const SceneNode = ({ data, yPos, xPos }: SceneNodeProps) => {
  return (
    <Card className={cn("w-[375px]", data.isFirstScene && "bg-primary/60")}>
      <CardHeader>
        <div className="flex justify-between gap-1">
          <CardTitle>{data.title}</CardTitle>
          <SceneEditor
            defaultValues={data}
            trigger={<EditIcon />}
            onSave={(values) =>
              getLocalRepository().updateScene({
                ...data,
                ...values,
                builderParams: { position: { x: xPos, y: yPos } },
              })
            }
            setFirstScene={() =>
              getLocalRepository()
                .updateFirstScene(data.storyKey, data.key)
                .then(() => {
                  // TODO: add success toast
                })
                .catch(() => {
                  // TODO: add error toast
                })
            }
          />
        </div>
        <CardDescription>{data.content}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {data.actions.map(({ text }, i) => (
          <div className="border p-2 relative border-primary">
            {text}
            <Handle
              type="source"
              id={`${data.key}-${i}`}
              position={Position.Right}
              className="absolute h-3 w-3"
              style={{ right: -7 }}
            />
          </div>
        ))}
      </CardContent>
      <Handle
        type="target"
        position={Position.Left}
        className="h-4 w-4"
        style={{ left: -7 }}
      />
    </Card>
  );
};
