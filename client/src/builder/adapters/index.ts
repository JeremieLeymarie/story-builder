import { Scene, Story } from "@/lib/storage/dexie/dexie-db";
import { SceneProps } from "../types";
import { Edge, Node } from "reactflow";

export const sceneToNodeAdapter = ({
  scene,
  story,
}: {
  scene: Scene;
  story: Story;
}): Node<SceneProps, "scene"> => {
  const node = {
    id: scene.id.toString(),
    position: scene.builderParams.position,
    type: "scene" as const,
    data: { ...scene, isFirstScene: scene.id === story.firstSceneId },
  };

  return node;
};

export const sceneToEdgesAdapter = (scene: Scene): Edge[] => {
  const edges = scene.actions
    .map((action, i) => {
      return {
        sourceHandle: `${scene.id}-${i}`,
        source: scene.id.toString(),
        target: action.sceneId?.toString() ?? null,
        targetHandle: null,
        id: `${scene.id}-${i}`,
      };
    })
    .filter((action) => !!action.target) as Edge[];
  return edges;
};

export const scenesToNodesAndEdgesAdapter = ({
  scenes,
  story,
}: {
  scenes: Scene[];
  story: Story;
}): [Node<SceneProps, "scene">[], Edge[]] => {
  return scenes.reduce(
    (acc, scene) => {
      const node = sceneToNodeAdapter({ scene, story });
      const edges = sceneToEdgesAdapter(scene);

      const nodes = [...acc[0], node];

      return [nodes, [...acc[1], ...edges]];
    },
    [[], []] as [Node<SceneProps, "scene">[], Edge[]],
  );
};

export const nodeToSceneAdapter = (node: Node<SceneProps, "scene">): Scene => {
  return {
    builderParams: { position: node.position },
    ...node.data,
  };
};
