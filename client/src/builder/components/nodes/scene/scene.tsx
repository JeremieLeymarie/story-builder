import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/design-system/primitives/card";
import { Handle, NodeProps, Position } from "@xyflow/react";
import { EditIcon } from "lucide-react";
import { SceneNodeType } from "../../../types";
import { cn } from "@/lib/style";
import { Button } from "@/design-system/primitives";
import { useBuilderEditorStore } from "@/builder/hooks/use-scene-editor-store";
import { Editor } from "@/design-system/components/editor/blocks/editor";
import { sceneConsts } from "./scene-constants";

export type SceneNodeProps = NodeProps<SceneNodeType>;

export const SceneNode = ({ data, selected }: SceneNodeProps) => {
  const isEditable = data.isEditable !== undefined ? data.isEditable : true;
  const openEditor = useBuilderEditorStore((state) => state.open);

  return (
    <Card
      style={{ width: sceneConsts.width }}
      className={cn(
        "group",
        data.isFirstScene && "bg-primary/60",
        selected && "border border-black",
      )}
      onDoubleClick={() => {
        openEditor({
          type: "scene-editor",
          payload: {
            scene: data,
            isFirstScene: data.isFirstScene,
          },
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
          {isEditable && (
            <Button
              className="invisible aspect-square group-hover:visible"
              size="icon"
              variant="ghost"
              onClick={() =>
                openEditor({
                  type: "scene-editor",
                  payload: {
                    scene: data,
                    isFirstScene: data.isFirstScene,
                  },
                })
              }
            >
              <EditIcon size={sceneConsts.editIconSize + "px"} />
            </Button>
          )}
        </div>
        <CardDescription>
          <Editor
            sceneKey={data.key}
            editable={false}
            editorSerializedState={data.content}
          />
        </CardDescription>
      </CardHeader>
      {data.actions.length > 0 && (
        <CardContent className={`gap-${sceneConsts.actionGap} flex flex-col`}>
          {data.actions.map(({ text }, i) => (
            <div
              style={{ padding: sceneConsts.actionInnerPadding + "px" }}
              className={cn(
                "border-primary relative border",
                !text && "text-muted-foreground italic",
              )}
              key={text || "..."}
            >
              {text || "..."}
              <Handle
                type="source"
                id={`${data.key}-${i}`}
                position={Position.Right}
              />
            </div>
          ))}
        </CardContent>
      )}
      <Handle type="target" position={Position.Left} />
    </Card>
  );
};
