import z from "zod/v4";
import {
  DEFAULT_SCENE,
  CreateScenePayload,
  useAddScenes,
} from "./use-add-scenes";
import { sceneSchema } from "../components/builder-editor-bar/scene-editor/schema";
import { useReactFlow } from "@xyflow/react";
import { makeSimpleSceneContent } from "@/lib/scene-content";
import { Scene } from "@/lib/storage/domain";
import { BuilderNode } from "../types";
import { nodeToSceneAdapter } from "../adapters";

export const scenesToJson = (scenes: Scene[]): string => {
  const keys = new Map(scenes.map((node, i) => [node.key, i]));
  return JSON.stringify(
    scenes.map((scene): CreateScenePayload => {
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
    ev.clipboardData?.setData(
      "text/plain",
      scenesToJson(nodes.map((nd) => nodeToSceneAdapter(nd))),
    );
    if (ev.type === "cut") deleteElements({ nodes });
  };

  const onPaste = (ev: ClipboardEvent) => {
    ev.preventDefault();
    const text = ev.clipboardData?.getData("text") ?? "[]";

    let scenes;
    try {
      scenes = clipboardSchema.parse(JSON.parse(text));
    } catch {
      scenes = [{ ...DEFAULT_SCENE, content: makeSimpleSceneContent(text) }];
    }

    addScenes(scenes, "auto");
  };

  return {
    onCopyOrCut,
    onPaste,
  };
};
