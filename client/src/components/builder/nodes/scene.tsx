import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/design-system/primitives/card";
import { Handle, NodeProps, Position } from "reactflow";

// const handleStyle = { left: 10 };

export type SceneNodeProps = NodeProps<{
  title: string;
  content: string;
  actions: { text: string; onClick: () => void }[];
}>;

export const SceneNode = ({
  data: { title, actions, content },
}: SceneNodeProps) => {
  return (
    <Card className="max-w-[400px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{content}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {actions.map(({ text }) => (
          <div className="border p-2 relative border-primary">
            {text}
            <Handle
              type="source"
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
