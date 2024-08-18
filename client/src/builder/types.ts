import { Node } from "reactflow";

export type SceneProps = {
  title: string;
  content: string;
  actions: { text: string; sceneKey?: string }[];
  key: string;
  storyKey: string;
  isFirstScene: boolean;
  isEditable?: boolean;
};

export type BuilderNode = Node<SceneProps, "scene">;
