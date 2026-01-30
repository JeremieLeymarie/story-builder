import { Scene, Story } from "@/lib/storage/domain";
import { BuilderEdge, SceneProps } from "../types";
import { Node } from "@xyflow/react";

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

export const hashEdgeId = ({
  sceneKey,
  actionKey,
  targetSceneKey,
}: EdgeIdentifier) => {
  return `${sceneKey}${EDGE_ID_SEPARATOR}${actionKey}${EDGE_ID_SEPARATOR}${targetSceneKey}`;
};

const sceneToEdgesAdapter = (scene: Scene): BuilderEdge[] => {
  const edges = scene.actions
    .flatMap((action) => {
      return action.targets.map(
        (target) =>
          ({
            type: "edge",
            sourceHandle: action.key,
            source: scene.key,
            target: target.sceneKey,
            targetHandle: null,
            id: hashEdgeId({
              sceneKey: scene.key,
              actionKey: action.key,
              targetSceneKey: target.sceneKey,
            }),
            data: {
              probability: target.probability,
              hasSiblings: action.targets.length > 1,
            },
          }) satisfies BuilderEdge,
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
}): [Node<SceneProps, "scene">[], BuilderEdge[]] => {
  return scenes.reduce(
    (acc, scene) => {
      const node = sceneToNodeAdapter({ scene, story });
      const edges = sceneToEdgesAdapter(scene);

      const nodes = [...acc[0], node];

      return [nodes, [...acc[1], ...edges]];
    },
    [[], []] as [Node<SceneProps, "scene">[], BuilderEdge[]],
  );
};

export const nodeToSceneAdapter = (node: Node<SceneProps, "scene">): Scene => {
  return {
    ...node.data,
  };
};
