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
    id: scene.key,
    position: scene.builderParams.position,
    type: "scene" as const,
    data: { ...scene, isFirstScene: scene.key === story.firstSceneKey },
  };

  return node;
};

export const sceneToEdgesAdapter = (scene: Scene): Edge[] => {
  const edges = scene.actions
    .map((action, i) => {
      return {
        sourceHandle: `${scene.key}-${i}`,
        source: scene.key.toString(),
        target: action.sceneKey?.toString() ?? null,
        targetHandle: null,
        id: `${scene.key}-${i}`,
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
