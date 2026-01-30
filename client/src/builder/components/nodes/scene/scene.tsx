import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/design-system/primitives/card";
import { Handle, NodeProps, Position } from "@xyflow/react";
import { EditIcon } from "lucide-react";
import { BuilderNode } from "../../../types";
import { cn } from "@/lib/style";
import { Button } from "@/design-system/primitives";
import { useBuilderEditorStore } from "@/builder/hooks/use-builder-editor-store";
import { useCopyPaste } from "@/builder/hooks/use-copy-paste";
import { useBuilderContext } from "@/builder/hooks/use-builder-context";

type SceneNodeProps = NodeProps<BuilderNode>;

export const SceneNode = ({ data, selected }: SceneNodeProps) => {
  const openEditor = useBuilderEditorStore((state) => state.open);
  const { isFirstScene, builderParams, isEditable = true, ...scene } = data;
  const { onAuxClick } = useCopyPaste();
  const { debug } = useBuilderContext();

  return (
    <Card
      className={cn(
        "group relative w-[375px]",
        isFirstScene && "bg-primary/60",
        selected && "border border-black",
      )}
      onAuxClick={(ev) => onAuxClick(ev, data)}
      onDoubleClick={() => {
        openEditor({
          type: "scene-editor",
          payload: { scene, isFirstScene },
        });
      }}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          {data.title ? (
            <CardTitle>{data.title}</CardTitle>
          ) : (
            <CardTitle className="text-muted-foreground italic">
              Empty Scene
            </CardTitle>
          )}
          {debug && (
            <div className="absolute -top-8 -left-0.5">
              <span className="font-semibold">Scene key:</span> {data.key}
            </div>
          )}
          {isEditable && (
            <Button
              className="hover:bg-accent/30 invisible group-hover:visible"
              size="xs"
              variant="ghost"
              onClick={() =>
                openEditor({
                  type: "scene-editor",
                  payload: { scene, isFirstScene },
                })
              }
            >
              <EditIcon />
            </Button>
          )}
        </div>
        {/* TODO: Re-add description in plain text  */}
      </CardHeader>
      {data.actions.length > 0 && (
        <CardContent className="flex flex-col gap-2">
          {data.actions.map(({ text, key }) => (
            <div
              key={key}
              className={cn(
                "border-primary relative border p-2",
                !text && "text-muted-foreground italic",
              )}
            >
              {text || "..."}
              {debug && (
                <div>
                  <span className="font-semibold">Action key:</span> {key}
                </div>
              )}
              <Handle
                type="source"
                id={key}
                position={Position.Right}
                className="h-[15px]! w-[15px]!"
              />
            </div>
          ))}
        </CardContent>
      )}
      <Handle
        type="target"
        position={Position.Left}
        className="h-[15px]! w-[15px]!"
      />
    </Card>
  );
};
