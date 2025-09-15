import { useBuilderContext } from "./use-builder-context";
import { XYPosition } from "@xyflow/react";
import { getBuilderService } from "@/get-builder-service";
import { sceneToNodeAdapter } from "../adapters";
import { Scene } from "@/lib/storage/domain";
import { useBuilderError } from "./use-builder-error";
import { makeSimpleLexicalContent } from "@/lib/lexical-content";
import { SceneSchema } from "../components/builder-editor-bar/scene-editor/schema";
import { useGetNewScenePosition } from "./use-get-new-scene-position";
import { useAddFocussedNodes } from "./use-add-focussed-nodes";
import { Vec2 } from "../position";
import { useSmartOffset } from "./use-smart-offset";

export const DEFAULT_SCENE: SceneSchema = {
  title: "",
  content: makeSimpleLexicalContent(""),
  actions: [],
};

export const useAddScene = () => {
  const builderService = getBuilderService();
  const { handleError } = useBuilderError();
  const { story } = useBuilderContext();
  const addNodes = useAddFocussedNodes();
  const { getNewScenePosition } = useGetNewScenePosition();
  const getOffset = useSmartOffset();

  const addScene = async ({
    payload = DEFAULT_SCENE,
    position,
  }: {
    payload?: SceneSchema;
    position: XYPosition | "auto";
  }): Promise<Scene | null> => {
    try {
      const newScenePosition =
        position === "auto" ? getNewScenePosition() : position;
      const initialScene = {
        ...payload,
        storyKey: story.key,
        builderParams: { position: Vec2.ZERO },
      };
      const offset = getOffset({
        desiredPosition: Vec2.from(newScenePosition),
        scenes: [initialScene],
      });
      initialScene.builderParams.position = offset;

      const scene = await builderService.addScene(initialScene);
      addNodes([sceneToNodeAdapter({ scene, story })]);
      return scene;
    } catch (err) {
      handleError(err);
      return null;
    }
  };

  return { addScene };
};
