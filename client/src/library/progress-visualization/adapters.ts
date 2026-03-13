import { Scene } from "@/lib/storage/domain";
import { Edge, Node } from "@xyflow/react";

export type ProgressNodeType = Node<
  {
    key: string;
    title: string;
  },
  "scene"
>;

export const scenesToNodesAndEdgesAdapter = (
  scenes: Scene[],
): [ProgressNodeType[], Edge[]] => {
  const nodes = scenes.map((scene) => ({
    id: scene.key,
    type: "scene",
    position: {
      x: scene.builderParams.position.x,
      y: scene.builderParams.position.y,
    },
    data: {
      key: scene.key,
      title: scene.title,
    },
  })) satisfies ProgressNodeType[];

  const edges = scenes.flatMap((scene) =>
    scene.actions.flatMap((action) =>
      action.targets.map((target) => ({
        id: `${action.key}-${target.sceneKey}`,
        type: "edge",
        source: scene.key,
        target: target.sceneKey,
      })),
    ),
  ) satisfies Edge[];
  return [nodes, edges] as const;
};
