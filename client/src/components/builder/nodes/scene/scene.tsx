import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/design-system/primitives/card";
import { Handle, NodeProps, Position } from "reactflow";
import { SceneEditor } from "./scene-editor";

export type SceneNodeProps = NodeProps<{
  title: string;
  content: string;
  actions: { text: string }[];
}>;

export const SceneNode = ({
  id,
  data: { title, actions, content },
}: SceneNodeProps) => {
  return (
    <Card className="max-w-[400px]">
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>{title}</CardTitle>
          <SceneEditor title={title} content={content} />
        </div>
        <CardDescription>{content}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {actions.map(({ text }, i) => (
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
