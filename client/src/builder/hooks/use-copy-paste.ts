import z from "zod/v4";
import { NewScene, useAddScenes } from "./use-add-scenes";
import { sceneSchema } from "../components/builder-editor-bar/scene-editor/schema";
import { useReactFlow } from "@xyflow/react";
import { nodeToSceneAdapter } from "../adapters";
import { BuilderNode } from "../types";

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
  const handleClipboard = (ev: ClipboardEvent) => {
    ev.preventDefault();

    if (ev.type === "paste") {
      const json = JSON.parse(ev.clipboardData?.getData("text") ?? "[]");
      const scenes = clipboardSchema.safeParse(json);

      if (!scenes.success) return;
      addScenes(scenes.data);
      return;
    }

    const nodes = getNodes().filter((nodes) => nodes.selected);
    if (!nodes.length) return;

    if (ev.type === "copy" || ev.type === "cut") {
      const id2idx = new Map(nodes.map((node, i) => [node.id, i]));
      ev.clipboardData?.setData(
        "text/plain",
        JSON.stringify(
          nodes.map((node): NewScene => {
            const scene = nodeToSceneAdapter(node);
            return {
              title: scene.title,
              content: scene.content,
              actions: scene.actions.map((action) => {
                const idx = id2idx.get(action.sceneKey ?? "");
                if (idx !== undefined) action.sceneKey = "=" + idx;
                return action;
              }),
              builderParams: scene.builderParams,
            };
          }),
        ),
      );
    }
    if (ev.type === "cut") deleteElements({ nodes });
  };

  return handleClipboard;
};
