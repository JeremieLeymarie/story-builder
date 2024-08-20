import { Node } from "@xyflow/react";

export type SceneProps = {
  title: string;
  content: string;
  actions: { text: string; sceneKey?: string }[];
  key: string;
  storyKey: string;
  isFirstScene: boolean;
  isEditable?: boolean;
};

export type SceneNodeType = Node<SceneProps, "scene">;

export type BuilderNode = SceneNodeType;
