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
import { useBuilderContext } from "@/builder/hooks/use-builder-context";
import { Action } from "@/lib/storage/domain";

type SceneNodeProps = NodeProps<BuilderNode>;

const DebugAction = ({ action }: { action: Action }) => {
  const { debug } = useBuilderContext();

  if (!debug) return null;
  return (
    <div>
      <p>
        <span className="font-semibold">Action key:</span> {action.key}
      </p>
      <p className="text-muted-foreground">{action.targets.length} targets</p>
    </div>
  );
};

export const SceneNode = ({ data, selected }: SceneNodeProps) => {
  const openEditor = useBuilderEditorStore((state) => state.open);
  const { isFirstScene, builderParams, isEditable = true, ...scene } = data;
  const { debug } = useBuilderContext();

  return (
    <Card
      className={cn(
        `group relative w-(--node-width)`,
        isFirstScene && "bg-primary/60",
        selected && "ring-black",
      )}
      onDoubleClick={() => {
        openEditor({
          type: "scene-editor",
          payload: { sceneKey: scene.key, isFirstScene },
        });
      }}
      id={isFirstScene ? "first-scene" : `scene-${scene.key}`}
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
                  payload: { sceneKey: scene.key, isFirstScene },
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
          {data.actions.map((action) => (
            <div
              key={action.key}
              className={cn(
                "ring-primary relative rounded-sm p-2 text-xs ring-1",
                !action.text && "text-muted-foreground italic",
              )}
            >
              {action.text || "..."}
              <DebugAction action={action} />
              <Handle
                type="source"
                id={action.key}
                position={Position.Right}
                className="h-3.75! w-3.75!"
              />
            </div>
          ))}
        </CardContent>
      )}
      <Handle
        type="target"
        position={Position.Left}
        className="h-3.75! w-3.75!"
      />
    </Card>
  );
};
