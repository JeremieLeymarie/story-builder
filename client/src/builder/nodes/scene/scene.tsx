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
import { toast } from "@/design-system/primitives";
import { getBuilderService } from "@/services";
import { useBuilderContext } from "@/builder/hooks/use-builder-store";

export type SceneNodeProps = NodeProps<SceneNodeType>;

export const SceneNode = ({
  data,
  positionAbsoluteY,
  positionAbsoluteX,
  selected,
}: SceneNodeProps) => {
  const builderService = getBuilderService();
  const isEditable = data.isEditable !== undefined ? data.isEditable : true;
  const { refresh } = useBuilderContext();

  return (
    <Card
      className={cn(
        "group w-[375px]",
        data.isFirstScene && "bg-primary/60",
        selected && "border border-black",
      )}
    >
      <CardHeader>
        <div className="flex justify-between gap-1">
          <CardTitle>{data.title}</CardTitle>
          <div className="invisible group-hover:visible">
            {isEditable && (
              <SceneEditor
                defaultValues={data}
                trigger={<EditIcon />}
                onSave={(values) => {
                  builderService.updateScene({
                    ...data,
                    ...values,
                    builderParams: {
                      position: { x: positionAbsoluteX, y: positionAbsoluteY },
                    },
                  });
                  refresh();
                }}
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
