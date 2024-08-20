import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/design-system/primitives/card";
import { Handle, NodeProps, Position } from "@xyflow/react";
import { SceneEditor } from "../../components/editors/scene-editor";
import { EditIcon } from "lucide-react";
import { SceneNodeType } from "../../types";
import { cn } from "@/lib/style";
import { getBuilderService } from "@/services/builder";
import { toast } from "@/design-system/primitives";

export type SceneNodeProps = NodeProps<SceneNodeType>;

export const SceneNode = ({
  data,
  positionAbsoluteY,
  positionAbsoluteX,
}: SceneNodeProps) => {
  const builderService = getBuilderService();
  const isEditable = data.isEditable !== undefined ? data.isEditable : true;

  return (
    <Card className={cn("w-[375px]", data.isFirstScene && "bg-primary/60")}>
      <CardHeader>
        <div className="flex justify-between gap-1">
          <CardTitle>{data.title}</CardTitle>
          {isEditable && (
            <SceneEditor
              defaultValues={data}
              trigger={<EditIcon />}
              onSave={(values) =>
                builderService.updateScene({
                  ...data,
                  ...values,
                  builderParams: {
                    position: { x: positionAbsoluteX, y: positionAbsoluteY },
                  },
                })
              }
              setFirstScene={() =>
                builderService
                  .changeFirstScene(data.storyKey, data.key)
                  .catch(() => {
                    toast({
                      title: "Operation failed",
                      description:
                        "Something went wrong. Could not change the first scene of the story",
                    });
                  })
              }
            />
          )}
        </div>
        <CardDescription>{data.content}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {data.actions.map(({ text }, i) => (
          <div className="relative border border-primary p-2" key={text}>
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
