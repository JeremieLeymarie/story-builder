import { Scene } from "@/lib/storage/domain";
import { Node } from "@xyflow/react";

export type SceneProps = Scene & {
  isFirstScene: boolean;
  isEditable?: boolean;
};

export type SceneNodeType = Node<SceneProps, "scene">;

export type StorylessScene = Omit<Scene, "storyKey">;

export type BuilderNode = SceneNodeType;
