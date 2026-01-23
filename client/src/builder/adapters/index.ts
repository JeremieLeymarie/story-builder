import { Scene, Story } from "@/lib/storage/domain";
import { SceneProps } from "../types";
import { Edge, Node } from "@xyflow/react";

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

type EdgeIdentifier = {
  sceneKey: string;
  actionKey: string;
  targetSceneKey: string;
};

const EDGE_ID_SEPARATOR = "#";

const hashEdgeId = ({
  sceneKey,
  actionKey,
  targetSceneKey,
}: EdgeIdentifier) => {
  return `${sceneKey}${EDGE_ID_SEPARATOR}${actionKey}${EDGE_ID_SEPARATOR}${targetSceneKey}`;
};

export const sceneToEdgesAdapter = (scene: Scene): Edge[] => {
  const edges = scene.actions
    .flatMap((action) => {
      return action.targets.map(
        (target) =>
          ({
            sourceHandle: action.key,
            source: scene.key,
            target: target.sceneKey,
            targetHandle: null,
            id: hashEdgeId({
              sceneKey: scene.key,
              actionKey: action.key,
              targetSceneKey: target.sceneKey,
            }),
          }) satisfies Edge,
      );
    })
    .filter((action) => !!action.target);

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
    ...node.data,
  };
};
