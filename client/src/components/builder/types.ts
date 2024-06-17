import { Node } from "reactflow";

export type SceneProps = {
  title: string;
  content: string;
  actions: { text: string }[];
};

export type BuilderNode = Node<SceneProps, "scene">;
