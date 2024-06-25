import { Scene } from "@/lib/storage/dexie-db";
import { SceneProps } from "./types";
import { Edge, Node } from "reactflow";

export const sceneToNodeAdapter = (scene: Scene): Node<SceneProps, "scene"> => {
  const node = {
    id: scene.id.toString(),
    position: scene.builderParams.position,
    type: "scene" as const,
    data: scene,
  };

  return node;
};

export const sceneToEdgesAdapter = (scene: Scene): Edge[] => {
  const edges = (
    scene.actions.filter((action) => !!action.sceneId) as {
      text: string;
      sceneId: number;
    }[]
  ).map((action, i) => ({
    sourceHandle: `${scene.id}-${i}`,
    source: scene.id.toString(),
    target: action.sceneId?.toString() ?? null,
    targetHandle: null,
    id: `${scene.id}-${i}`,
  }));
  return edges;
};

export const scenesToNodesAndEdgesAdapter = (
  scenes: Scene[]
): [Node<SceneProps, "scene">[], Edge[]] => {
  return scenes.reduce(
    (acc, scene) => {
      const node = sceneToNodeAdapter(scene);
      const edges = sceneToEdgesAdapter(scene);

      const nodes = [...acc[0], node];

      return [nodes, [...acc[1], ...edges]];
    },
    [[], []] as [Node<SceneProps, "scene">[], Edge[]]
  );
};

export const nodeToSceneAdapter = (node: Node<SceneProps, "scene">): Scene => {
  return {
    builderParams: { position: node.position },
    ...node.data,
  };
};
