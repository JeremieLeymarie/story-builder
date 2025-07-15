import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/design-system/primitives/card";
import { Handle, NodeProps, Position } from "@xyflow/react";
import { EditIcon } from "lucide-react";
import { SceneNodeType } from "../../types";
import { cn } from "@/lib/style";
import { useNewEditorStore } from "@/builder/components/scene-editor/hooks/use-new-editor-store";
import { Button } from "@/design-system/primitives";

export type SceneNodeProps = NodeProps<SceneNodeType>;

export const SceneNode = ({ data, selected }: SceneNodeProps) => {
  const isEditable = data.isEditable !== undefined ? data.isEditable : true;
  const { open: openEditor } = useNewEditorStore();

  return (
    <Card
      className={cn(
        "group w-[375px]",
        data.isFirstScene && "bg-primary/60",
        selected && "border border-black",
      )}
      onDoubleClick={() => openEditor(data.key)}
    >
      <CardHeader>
        <div className="flex justify-between gap-1">
          {data.title ? (
            <CardTitle className="text-3xl">{data.title}</CardTitle>
          ) : (
            <CardTitle className="text-muted-foreground italic">
              Empty Scene
            </CardTitle>
          )}
          {isEditable && (
            <Button
              className="invisible aspect-square group-hover:visible"
              size="icon"
              variant="ghost"
              onClick={() => openEditor(data.key)}
            >
              <EditIcon size="20px" />
            </Button>
          )}
        </div>
        <CardDescription>
          {data.content ? data.content : "Double Click to edit"}
        </CardDescription>
      </CardHeader>
      {data.actions.length > 0 && (
        <CardContent className="flex flex-col gap-2">
          {data.actions.map(({ text }, i) => (
            <div className="border-primary relative border p-2" key={text}>
              {text}
              <Handle
                type="source"
                id={`${data.key}-${i}`}
                position={Position.Right}
                className="absolute !right-[-10px] !h-[15px] !w-[15px]"
              />
            </div>
          ))}
        </CardContent>
      )}
      <Handle
        type="target"
        position={Position.Left}
        className="!right-[-10px] !h-[15px] !w-[15px]"
      />
    </Card>
  );
};
