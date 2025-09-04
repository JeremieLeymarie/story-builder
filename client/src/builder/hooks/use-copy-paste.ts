import z from "zod/v4";
import { DEFAULT_SCENE, NewScene, useAddScenes } from "./use-add-scenes";
import { sceneSchema } from "../components/builder-editor-bar/scene-editor/schema";
import { useReactFlow } from "@xyflow/react";
import { nodeToSceneAdapter } from "../adapters";
import { BuilderNode } from "../types";
import { makeSimpleSceneContent } from "@/lib/scene-content";

export const deserialize = (nodes: BuilderNode[]): string => {
  const keys = new Map(nodes.map((node, i) => [node.data.key, i]));
  return JSON.stringify(
    nodes.map((node): NewScene => {
      const scene = nodeToSceneAdapter(node);
      return {
        title: scene.title,
        content: scene.content,
        actions: scene.actions.map((action) => {
          const idx = keys.get(action.sceneKey ?? "");
          if (idx !== undefined) action.sceneKey = "=" + idx;
          return action;
        }),
        builderParams: scene.builderParams,
      };
    }),
  );
};

export const useCopyPaste = () => {
  const { addScenes } = useAddScenes();
  const { getNodes, deleteElements } = useReactFlow<BuilderNode>();

  const clipboardSchema = z.array(
    sceneSchema.extend({
      builderParams: z.object({
        position: z.object({ x: z.number(), y: z.number() }),
      }),
    }),
  );

  const onCopyOrCut = (ev: ClipboardEvent) => {
    ev.preventDefault();
    const nodes = getNodes().filter((nodes) => nodes.selected);
    if (!nodes.length) return;
    ev.clipboardData?.setData("text/plain", deserialize(nodes));
    if (ev.type === "cut") deleteElements({ nodes });
  };

  const onPaste = (ev: ClipboardEvent) => {
    ev.preventDefault();
    const text = ev.clipboardData?.getData("text") ?? "[]";
    const scenes = clipboardSchema.safeParse(JSON.parse(text));

    addScenes(
      scenes.success
        ? scenes.data
        : [{ ...DEFAULT_SCENE, content: makeSimpleSceneContent(text) }],
    );
  };

  return {
    onCopyOrCut,
    onPaste,
  };
};
