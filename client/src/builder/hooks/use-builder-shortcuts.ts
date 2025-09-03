import { useTestStory } from "./use-test-story";
import { useExportModalStore } from "./use-export-modal-store";
import { useReactFlow, useStoreApi } from "@xyflow/react";
import { useBuilderContext } from "./use-builder-context";
import { nodeToSceneAdapter } from "../adapters";
import { BuilderNode } from "../types";
import z from "zod";
import { DEFAULT_SCENE, NewScene, useAddScenes } from "./use-add-scenes";
import { sceneSchema } from "../components/builder-editor-bar/scene-editor/schema";

export const useBuilderShortCuts = ({
  firstSceneKey,
}: {
  firstSceneKey: string;
}) => {
  const { reactFlowRef } = useBuilderContext();
  const { addScenes } = useAddScenes();
  const openExportModal = useExportModalStore((state) => state.setOpen);
  const { testStory } = useTestStory();
  const { getNodes, deleteElements } = useReactFlow<BuilderNode>();
  const { addSelectedNodes } = useStoreApi().getState();

  if (!reactFlowRef.current) return;

  const shortcuts: Record<string, (e: KeyboardEvent) => void> = {
    ["n"]() {
      addScenes([DEFAULT_SCENE]);
    },
    ["t"]() {
      testStory(firstSceneKey);
    },
    ["e"]() {
      openExportModal(true);
    },
    ["ctrl+a"]() {
      addSelectedNodes(getNodes().map((node) => node.id));
    },
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.isComposing) return;
    const key = e.key.toLocaleLowerCase();

    for (const binding of Object.keys(shortcuts)) {
      if (!binding.endsWith(key)) continue;
      e.preventDefault();
      if (e.repeat) return;
      if (binding.match("ctrl") && !e.ctrlKey) continue;
      if (binding.match("shift") && !e.shiftKey) continue;
      if (binding.match("alt") && !e.altKey) continue;
      shortcuts[binding]!(e);
    }
  };

  const clipboardSchema = z.array(
    sceneSchema.extend({
      builderParams: z.object({
        position: z.object({ x: z.number(), y: z.number() }),
      }),
    }),
  );

  const handleClipboard = (ev: ClipboardEvent) => {
    reactFlowRef.current?.focus();
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

  reactFlowRef.current.onkeydown = handleKeyPress;
  reactFlowRef.current.onpaste = handleClipboard;
  reactFlowRef.current.oncopy = handleClipboard;
  reactFlowRef.current.oncut = handleClipboard;
};
