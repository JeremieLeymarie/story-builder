import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/design-system/primitives/card";
import { Handle, NodeProps, Position, useReactFlow } from "@xyflow/react";
import { EditIcon } from "lucide-react";
import { SceneNodeType } from "../../../types";
import { cn } from "@/lib/style";
import { Button } from "@/design-system/primitives";
import { useBuilderEditorStore } from "@/builder/hooks/use-scene-editor-store";
import { RichText } from "@/design-system/components/editor/blocks/rich-text-editor";
import { useCopyPaste } from "@/builder/hooks/use-copy-paste";

export type SceneNodeProps = NodeProps<SceneNodeType>;

export const SceneNode = ({ data, selected }: SceneNodeProps) => {
  const openEditor = useBuilderEditorStore((state) => state.open);
  const { isFirstScene, builderParams, isEditable, ...scene } = data;
  const editable = data.isEditable !== undefined ? data.isEditable : true;
  const { updateNode } = useReactFlow();
  const { onCopyOrCut } = useCopyPaste();

  return (
    <Card
      className={cn(
        "group w-[375px]",
        isFirstScene && "bg-primary/60",
        selected && "border border-black",
      )}
      onAuxClick={(mouse_ev) => {
        mouse_ev.preventDefault();
        const ev = new ClipboardEvent("cut", {
          clipboardData: new DataTransfer(),
        });
        updateNode(data.key, { selected: true });
        setTimeout(() => {
          onCopyOrCut(ev);
          if (ev.clipboardData) {
            navigator.clipboard.writeText(ev.clipboardData.getData("text"));
          }
        });
      }}
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
          {editable && (
            <Button
              className="invisible aspect-square group-hover:visible"
              size="icon"
              variant="ghost"
              onClick={() =>
                openEditor({
                  type: "scene-editor",
                  payload: { scene, isFirstScene },
                })
              }
            >
              <EditIcon size="20px" />
            </Button>
          )}
        </div>
        <CardDescription>
          <RichText editable={false} initialState={data.content} />
        </CardDescription>
      </CardHeader>
      {data.actions.length > 0 && (
        <CardContent className="flex flex-col gap-2">
          {data.actions.map(({ text }, i) => (
            <div
              className={cn(
                "border-primary relative border p-2",
                !text && "text-muted-foreground italic",
              )}
              key={text || "..."}
            >
              {text || "..."}
              <Handle
                type="source"
                id={`${data.key}-${i}`}
                position={Position.Right}
                className="!h-[15px] !w-[15px]"
              />
            </div>
          ))}
        </CardContent>
      )}
      <Handle
        type="target"
        position={Position.Left}
        className="!h-[15px] !w-[15px]"
      />
    </Card>
  );
};
