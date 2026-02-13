import { Scene } from "@/lib/storage/domain";
import { Edge, Node } from "@xyflow/react";

// NODES

export type SceneProps = Scene & {
  isFirstScene: boolean;
  isEditable?: boolean;
};

export const NODE_WIDTH = 300;

export type BuilderNode = Node<SceneProps, "scene">;

// EDGES

export type BuilderEdge = Edge<{ probability: number; hasSiblings: boolean }>;

// MISC

export type StorylessScene = Omit<Scene, "storyKey">;
