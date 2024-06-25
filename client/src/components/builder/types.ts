import { Node } from "reactflow";

export type SceneProps = {
  title: string;
  content: string;
  actions: { text: string; sceneId?: number }[];
  id: number;
  storyId: number;
};

export type BuilderNode = Node<SceneProps, "scene">;
