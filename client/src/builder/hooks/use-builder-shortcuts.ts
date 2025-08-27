import { useTestStory } from "./use-test-story";
import { useExportModalStore } from "./use-export-modal-store";
import { useAddScene } from "./use-add-scene";
import { useReactFlow } from "@xyflow/react";
import { useBuilderContext } from "./use-builder-context";
import { nodeToSceneAdapter } from "../adapters";
import { BuilderNode } from "../types";
import { sceneSchema } from "../components/scene-editor/schema";

export const useBuilderShortCuts = ({
  firstSceneKey,
}: {
  firstSceneKey: string;
}) => {
  const { reactFlowRef } = useBuilderContext();
  const { addScene } = useAddScene();
  const openExportModal = useExportModalStore((state) => state.setOpen);
  const { testStory } = useTestStory();
  const { getNodes, deleteElements } = useReactFlow<BuilderNode>();

  if (!reactFlowRef.current) return;

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.repeat || e.isComposing) return;
    const key = e.key.toLocaleLowerCase();

    switch (key) {
      case "n":
        addScene();
        e.preventDefault();
        break;
      case "t":
        testStory(firstSceneKey);
        e.preventDefault();
        break;
      case "e":
        openExportModal(true);
        e.preventDefault();
        break;
    }
  };

  const handleClipboard = (ev: ClipboardEvent) => {
    reactFlowRef.current?.focus();
    ev.preventDefault();

    if (ev.type === "paste") {
      const json = JSON.parse(ev.clipboardData?.getData("text") ?? "[]");
      const scenes = sceneSchema.array().safeParse(json);

      if (!scenes.success) return;
      for (const scene of scenes.data) {
        addScene(undefined, scene);
      }
      return;
    }

    const nodes = getNodes().filter((nodes) => nodes.selected);
    if (!nodes.length) return;

    if (ev.type === "copy" || ev.type === "cut") {
      ev.clipboardData?.setData(
        "text/plain",
        JSON.stringify(nodes.map((node) => nodeToSceneAdapter(node))),
      );
    }

    if (ev.type === "cut") deleteElements({ nodes });
  };

  reactFlowRef.current.onkeydown = handleKeyPress;
  reactFlowRef.current.onpaste = handleClipboard;
  reactFlowRef.current.oncopy = handleClipboard;
  reactFlowRef.current.oncut = handleClipboard;
};
