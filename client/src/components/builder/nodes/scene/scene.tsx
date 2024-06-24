import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/design-system/primitives/card";
import { Handle, NodeProps, Position } from "reactflow";
import { SceneEditor } from "../../scene-editor";
import { EditIcon } from "lucide-react";
import { getRepository } from "@/lib/storage/indexed-db-repository";
import { SceneProps } from "../../types";

export type SceneNodeProps = NodeProps<SceneProps>;

export const SceneNode = ({ id, data, yPos, xPos }: SceneNodeProps) => {
  return (
    <Card className="w-[375px]">
      <CardHeader>
        <div className="flex justify-between gap-1">
          <CardTitle>{data.title}</CardTitle>
          <SceneEditor
            defaultValues={data}
            trigger={<EditIcon />}
            onSave={(values) =>
              getRepository().updateScene({
                ...data,
                ...values,
                actions: [],
                builderParams: { position: { x: xPos, y: yPos } },
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
              id={`${id}-${i}`}
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