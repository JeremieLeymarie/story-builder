import { useBuilderContext } from "./use-builder-context";
import { useReactFlow, XYPosition, Node } from "@xyflow/react";
import { getBuilderService } from "@/get-builder-service";
import { SceneSchema } from "../components/scene-editor/schema";
import { makeSimpleSceneContent } from "@/lib/scene-content";
import { sceneToNodeAdapter } from "../adapters";
import { Dispatch, SetStateAction } from "react";
import { SceneNodeType } from "../types";

export const DEFAULT_SCENE: SceneSchema = {
  title: "",
  content: makeSimpleSceneContent(""),
  actions: [],
};

export const useAddScene = (
  setNodes: Dispatch<SetStateAction<SceneNodeType[]>>,
) => {
  const builderService = getBuilderService();
  const { story } = useBuilderContext();

  const { screenToFlowPosition } = useReactFlow();
  const { reactFlowRef } = useBuilderContext();

  const getCenterPosition = () => {
    if (!reactFlowRef.current) return { x: 0, y: 0 };

    const rect = reactFlowRef.current.getBoundingClientRect();
    const position = {
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height / 2,
    };
    return position;
  };

  // FUTURE: this is a bit slow, is there way to render the new node first and then add it to the db?
  const addScene = async (
    position: XYPosition = getCenterPosition(),
    scene: SceneSchema = DEFAULT_SCENE,
  ): Promise<Node> => {
    const node = sceneToNodeAdapter({
      scene: await builderService.addScene({
        ...scene,
        storyKey: story.key,
        builderParams: { position: screenToFlowPosition(position) },
      }),
      story,
    });
    setNodes((nds) => nds.concat(node));
    return node;
  };

  return { addScene };
};
